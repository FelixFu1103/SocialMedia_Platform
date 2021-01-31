const createPostValidator = (req, res, next) => {
    // title
    req.check('title').notEmpty().withMessage('Title is required!');
    req.check('title', 'Title must be between 4 to 15 characters').isLength({
        min: 4,
        max: 15
    });
    // body
    req.check('body').notEmpty().withMessage('Body is required!');
    req.check('body', 'Body must be between 4 to 200 characters').isLength({
        min: 4,
        max: 200
    });
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
};

const userSignupValidator = (req, res, next) => {
    // name is not null and between 4-10 characters
    req.check('name').notEmpty().withMessage('Name is required');
    // email is not null, valid and normalized
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 3,
            max: 32
        });
    // check for password
    req.check('password').notEmpty().withMessage('Password is required');
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const err = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: err });
    }
    // proceed to next middleware
    next();
};

const userSigninValidator = (req, res, next) => {
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        )
        .withMessage('Please type your valid email address')
        .isLength({
            min: 3,
            max: 32
        });
    req.check('password').notEmpty().withMessage('Invalid Social Login Token!');
    req
        .check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

const passwordResetValidator = (req, res, next) => {
    // check for password
    req.check('newPassword', 'Password is required').notEmpty();
    req.check('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long')
        .matches(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        )
        .withMessage('must contain a number')
        .withMessage('Password must contain a number');

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};


exports.userSigninValidator = userSigninValidator
exports.userSignupValidator = userSignupValidator
exports.createPostValidator = createPostValidator
exports.passwordResetValidator = passwordResetValidator