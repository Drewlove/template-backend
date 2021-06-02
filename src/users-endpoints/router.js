const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointService = require("./service");
const logger = require("../logger");

const endpointRouter = express.Router();
const jsonParser = express.json();

//REWRITE, include each row from table
const table = {
  name: "user",
  columns: [
    { colName: "user_id", xss: false },
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

endpointRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRows(knexInstance)
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  })
  //refactor so this is dynamic, and only requires the table object on line 10 to be changed
  .post(jsonParser, (req, res, next) => {
    const { user_id, first_name, last_name } = req.body;
    const newRow = { user_id, first_name, last_name };

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
          .location(path.posix.join(req.originalUrl, `/${row[table.rowId]}`))
          .json(serializeRow(row));
      })
      .catch(next);
  });

endpointRouter
  .route("/:row_id")
  .all((req, res, next) => {
    endpointService
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
  })
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete((req, res, next) => {
    endpointService
      .deleteRow(req.app.get("db"), req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    ////refactor so this is dynamic, and only requires the table object on line 10 to be changed
    const { user_id, first_name, last_name } = req.body;
    const rowToUpdate = { user_id, first_name, last_name };

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
  });

module.exports = endpointRouter;
