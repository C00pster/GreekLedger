const jwt = require('jsonwebtoken');
const User = require('../schemas/User');
const GreekChapter = require('../schemas/GreekChapter');

const addCredentials = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!req.headers.authorization) return res.status(401).send('Access Denied');

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).send('Access Denied');

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const member = await User.findById(verified._id);

        req.auth = {};
        req.auth.admin = member.admin;
        if (member.greekOrg) {
            req.auth.greekOrg = member.greekOrg;
            req.auth.greekOrgRole = member.greekOrgRole;
            if (member.greekChapter) {
                req.auth.greekChapter = member.greekChapter;
                req.auth.greekChapterRole = member.greekChapterRole;
            }
        }
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

const roleChecks = {
    /* Checks if user is admin */
    admin: (auth) => auth.admin,

    /* Checks if user is president of given greek org. If no greek org is given, find the greek org of
    the given greek chapter and checks if the user is president of that. Otherwise false. */
    greekOrgPresident: async (auth, reqGreekOrg, reqGreekChapter) => {
        if (auth.greekOrgRole === 'president') {
            if (!reqGreekOrg) {
                if (!reqGreekChapter) return false;
                else {
                    const greekChapter = await GreekChapter.findById(reqGreekChapter);
                    if (auth.greekOrg === greekChapter.greekOrg.toString()) {
                        return true;
                    } else return false;
                }
            } else return auth.greekOrg === reqGreekOrg;
        } else return false;
    },

    /* Checks if user is officer of given greek org. If no greek org is given, finds the greek org of
    the given greek chapter and checks if the user is officer of that. Otherwise false. */
    greekOrgOfficer: async (auth, reqGreekOrg, reqGreekChapter) => {
        if (auth.greekOrgRole === 'officer') {
            if (!reqGreekOrg) {
                if (!reqGreekChapter) return false;
                else {
                    const greekChapter = await GreekChapter.findById(reqGreekChapter);
                    if (auth.greekOrg === greekChapter.greekOrg.toString()) {
                        return true;
                    } else return false;
                }
            } else return auth.greekOrg === reqGreekOrg;
        } else return false;
    },
    
    /* Checks if user is president of given greek chapter. If no greek chapter is given, returns false. */
    greekChapterPresident: (auth, greekOrg, greekChapter) => auth.greekChapterRole === 'president' && auth.greekChapter === greekChapter,
    
    /* Checks if user is officer of given greek chapter. If no greek chapter is given, returns false. */
    greekChapterOfficer: (auth, greekOrg, greekChapter) => auth.greekChapterRole === 'officer' && auth.greekChapter === greekChapter,
};

const roleHierarchy = {
    admin: ['admin'],
    greekOrgPresident: ['admin', 'greekOrgPresident'],
    greekOrgOfficer: ['admin', 'greekOrgPresident', 'greekOrgOfficer'],
    greekChapterPresident: ['admin', 'greekOrgPresident', 'greekOrgOfficer', 'greekChapterPresident'],
    greekChapterOfficer: ['admin', 'greekOrgPresident', 'greekOrgOfficer', 'greekChapterPresident', 'greekChapterOfficer'],
};

/* Function to check access based on role hierarchy above. */
const checkAccess = (role) => {
    return async (req, res, next) => {
        try {
            const auth = req.auth;
            const rolesToCheck = roleHierarchy[role];


            for (let i = 0; i < rolesToCheck.length; i++) {
                const checkResult = await roleChecks[rolesToCheck[i]](auth, req.check.greekOrg, req.check.greekChapter);
                if (checkResult) {
                    next();
                    return;
                }
            }

            res.status(401).send('Access Denied');
        } catch (err) {
            res.status(500).send('Server Error');
        }
    };
};

/* Function to check roles irrespective of role hierarchy. */
const checkAccessExplicit = (roles) => {
    return async (req, res, next) => {
        try {
            const auth = req.auth;
            const rolesToCheck = roles;

            for (let i = 0; i < rolesToCheck.length; i++) {
                const checkResult = await roleChecks[rolesToCheck[i]](auth, req.check.greekOrg, req.check.greekChapter);
                if (checkResult) {
                    next();
                    return;
                }
            }

            res.status(401).send('Access Denied');
        } catch (err) {
            res.status(500).send('Server Error');
        }
    };
};

module.exports = {
    addCredentials,
    checkAccess,
    checkAccessExplicit
};