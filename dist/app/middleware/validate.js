"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => async (req, _res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.validate = validate;
