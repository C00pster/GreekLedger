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
    isAdmin: (auth) => auth.admin,

    /* Checks if user is president of given greek org. If no greek org is given, find the greek org of
    the given greek chapter and checks if the user is president of that. Otherwise false. */
    isGreekOrgPresident: async (auth, reqGreekOrg, reqGreekChapter) => {
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
    isGreekOrgOfficer: async (auth, reqGreekOrg, reqGreekChapter) => {
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
    isGreekChapterPresident: (auth, greekOrg, greekChapter) => auth.greekChapterRole === 'president' && auth.greekChapter === greekChapter,
    
    /* Checks if user is officer of given greek chapter. If no greek chapter is given, returns false. */
    isGreekChapterOfficer: (auth, greekOrg, greekChapter) => auth.greekChapterRole === 'officer' && auth.greekChapter === greekChapter,
};

const roleHierarchy = {
    admin: ['isAdmin'],
    greekOrgPresident: ['isAdmin', 'greekOrgPresident'],
    greekOrgOfficer: ['isAdmin', 'greekOrgPresident', 'greekOrgOfficer'],
    greekChapterPresident: ['isAdmin', 'greekOrgPresident', 'greekOrgOfficer', 'greekChapterPresident'],
    greekChapterOfficer: ['isAdmin', 'greekOrgPresident', 'greekOrgOfficer', 'greekChapterPresident', 'greekChapterOfficer'],
};

/* Function to check access based on role hierarchy above. */
const checkAccess = (role, greekOrg, greekChapter) => {
    return async (req, res, next) => {
        try {
            const auth = req.auth;
            const rolesToCheck = roleHierarchy[role];

            for (let i = 0; i < rolesToCheck.length; i++) {
                const checkResult = await roleChecks[rolesToCheck[i]](auth, greekOrg, greekChapter);
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
const checkAccessExplicit = (roles, greekOrg, greekChapter) => {
    return (req, res, next) => {
        const auth = req.auth;
        const rolesToCheck = roles;

        const isAuthorized = rolesToCheck.some(role => roleChecks[role](auth, greekOrg, greekChapter));

        if (isAuthorized) {
            next();
        } else {
            res.status(401).send('Access Denied');
        }
    }
};

module.exports = {
    addCredentials,
    checkAccess,
    checkAccessExplicit
};