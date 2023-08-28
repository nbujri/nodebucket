/**
 * title: employee.js
 * author: ngi bujri
 * date: august 14 2023
 */

"use strict";

const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");

const ajv = new Ajv();

// category schema
const categorySchema = {
  type: "object",
  properties: {
    categoryName: { type: "string" },
    backgroundColor: { type: "string" },
  },
  required: ["categoryName", "backgroundColor"],
  additionalProperties: false,
};

// task schema
const taskSchema = {
  type: "object",
  properties: {
    text: {
      type: "string",
    },
    category: categorySchema,
  },
  required: ["text", "category"],
  additionalProperties: false,
};

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
        res.send(employee);
      }
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 * findAllTasks
 */
router.get("/:empId/tasks", (req, res, next) => {
  try {
    console.log("findAllTasks API");

    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne({ empId }, { projection: { empId: 1, todo: 1, done: 1 } });
      console.log("tasks", tasks);

      if (!tasks) {
        const err = new Error("unable to find tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.send(tasks);
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

/**
 *  createTask
 */
router.post("/:empId/tasks", (req, res, next) => {
  try {
    console.log("createTask API");

    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("input must be a number");
      err.status = 400;
      console.log("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      console.log("employee", employee);

      if (!employee) {
        const err = new Error("unable to find employee with empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      const { task } = req.body;
      console.log("New Task: ", task);
      console.log("body", req.body);

      // const { text } = req.body;
      // console.log("req.body", req.body);

      // validate req object
      const validator = ajv.compile(taskSchema);
      const valid = validator(task);

      console.log("valid", valid);

      if (!valid) {
        const err = new Error("bad request");
        err.status = 400;
        err.errors = validator.errors;
        console.log("req.body validation failed", err);
        next(err);
        return;
      }

      // task object
      const newTask = {
        _id: new ObjectId(),
        text: task.text,
        category: task.category,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: newTask } });

      console.log("result", result);

      if (!result.modifiedCount) {
        const err = new Error("unable to create tasks for empId" + empId);
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

module.exports = router;
