//REWRITE, make note of 'orderRow' if you want rows returned alphabetically
const table = {
  name: "app_user",
  id: "auth0_sub",
  orderRow: "last_name",
};

const logger = require("../logger");
const service = {
  getAllRows(knex) {
    return knex.select("*").from(table.name).orderBy(table.orderRow, "ASC");
  },
  getById(knex, row_id) {
    return knex.from(table.name).select("*").where(table.id, row_id).first();
  },
  insertRow(knex, newRow) {
    return knex
      .insert(newRow)
      .into(table.name)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateRow(knex, row_id, newFields) {
    return knex(table.name).where(`${table.name}_id`, row_id).update(newFields);
  },
  deleteRow(knex, row_id) {
    return knex(table.name).where(`${table.name}_id`, row_id).delete();
  },
};

module.exports = service;
