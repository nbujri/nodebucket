/**
 * title: employee.js
 * author: ngi bujri
 * date: august 14 2023
 */

"use strict";

const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");

/**
 * findEmployeeById
 * Description: Accept values 1007-1012
 */
router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params; // get empId from req.params object
    empId = parseInt(empId, 10); // determine if empId is numerical value

    if (isNaN(empId)) {
      const err = new Error("Input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId }); // find employee by ID

      if (!employee) {
        const err = new Error(`Unable to find employee with empID ${empId}`);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      } else {
        res.json(employee);
      }
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
