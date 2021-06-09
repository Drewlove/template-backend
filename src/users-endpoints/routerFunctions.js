const path = require("path");
const xss = require("xss");
const endpointService = require("./service");
const logger = require("../logger");

const table = {
  name: "user",
  columns: [
    { colName: "auth0_sub", xss: false },
    { colName: "first_name", xss: true },
    { colName: "last_name", xss: true },
  ],
};

const serializeRow = (row) => {
  let obj = {};
  table.columns.forEach((key) => {
    obj[key.colName] = key.xss ? xss(row[key.colName]) : row[key.colName];
  });
  return obj;
};

const routerFunctions = {
  //   getAllRowsMatchingUserId(req, res, next) {
  //     const knexInstance = req.app.get("db");
  //     endpointService
  //       .getAllRowsMatchingUserId(knexInstance, req.params.app_user_id)
  //       .then((rows) => {
  //         res.json(rows.map(serializeRow));
  //       })
  //       .catch(next);
  //   },
  getAllRows(req, res, next) {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRows(knexInstance)
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  },
  insertRow(req, res, next) {
    const { department_name } = req.body;
    const app_user_id = req.params.app_user_id;
    const newRow = { department_name, app_user_id };
    for (const [key, value] of Object.entries(newRow))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    endpointService
      .insertRow(req.app.get("db"), newRow)
      .then((row) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${row.department_id}`))
          .json(serializeRow(row));
      })
      .catch(next);
  },

  getById(req, res, next) {
    endpointService
      //   .getById(req.app.get("db"), req.params.app_user_id, req.params.row_id)
      .getById(req.app.get("db"), req.params.row_id)
      .then((row) => {
        if (!row) {
          return res.status(404).json({
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
        }
        res.row = row;
        next();
      })
      .catch(next);
  },

  delete(req, res, next) {
    endpointService
      .deleteRow(req.app.get("db"), req.params.app_user_id, req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  },
  patch(req, res, next) {
    const { first_name, last_name } = req.body;
    const rowToUpdate = { first_name, last_name };
    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body content must contain at least one of the following: ${table.columns}`,
        },
      });

    endpointService
      .updateRow(req.app.get("db"), req.params.row_id, rowToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  },
};

module.exports = routerFunctions;
