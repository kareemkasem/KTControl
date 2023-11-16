import { ObjectId, WithId } from "mongodb";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Employee, EmployeeFormInput } from "../types";
import { EmployeeSchema } from "../models/Employee";
import { generateSalt } from "../utils/generateSalt";
import {COLLECTIONS} from "../database";

// Get /employee/:id
export async function getEmployee(
	req: Request<{ id: string }>,
	res: Response<WithId<Employee> | { message: string }>
) {
	const id: string = req.params.id;
	try {
		const employee = await COLLECTIONS.employees.findOne<WithId<Employee>>({
			_id: new ObjectId(id),
		});
		if (!employee) {
			res.status(404).send({ message: "Employee not found" });
			return;
		}
		res.status(200).render("Employee/employee", { ...employee });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}

// GET /employee
export async function getAllEmployees(req: Request, res: Response) {
	try {
		const employees = await COLLECTIONS.employees.find<WithId<Employee>>({}).toArray();
		if (!employees) {
			res.status(404).send({ message: "no Employees found" });
			return;
		}
		res.status(200).render("Employee/employee-list", { employees });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}

// GET /new-employee
export async function getNewEmployeePage(req: Request, res: Response) {
	res.render("Employee/new-employee");
}

// POST /employee
export async function createEmployee(
	req: Request<{}, {}, EmployeeFormInput>,
	res: Response
) {
	const {
		name,
		title,
		username,
		password,
		code,
		hourlyRate,
		clockIn,
		clockOut,
	} = req.body;
	let employee: Employee = {
		name,
		title,
		username,
		password,
		code,
		hourlyRate,
		workHours: { clockIn, clockOut },
	};

	const { value, error } = EmployeeSchema.validate(employee);
	if (error) {
		res.send({ message: error.message });
		return;
	} else {
		employee = value;
	}

	let salt: string;
	try {
		salt = await generateSalt();
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
		return;
	}
	employee.password = await bcrypt.hash(employee.password, salt);

	try {
		// * please notice that you have an index on code and username that forces it to be unique
		await COLLECTIONS.employees.insertOne(employee);
		res.status(201).redirect("/employee");
	} catch (e) {
		res.status(400).send({ message: `from mongo: ${(e as Error).message}` });
	}
}

// GET /update-employee/:id
export async function getUpdateEmployee(
	req: Request<{ id: string }>,
	res: Response<{ message: string }>
) {
	const id = req.params.id;

	try {
		const employee: WithId<Employee> | null = await COLLECTIONS.employees.findOne({
			_id: new ObjectId(id),
		});
		if (!employee) {
			res.status(404).send({ message: "Employee not found" });
			return;
		}

		res.status(200).render("Employee/update-employee", { ...employee });
	} catch (e) {
		res.status(500).send({ message: (e as Error).message });
	}
}

// POST /update-employee/:id
export async function updateEmployee(
	req: Request<{ id: string }, {}, EmployeeFormInput>,
	res: Response<{ message: string }>
) {
	// * for more atomization, this Function does NOT change password
	let id = req.params.id;
	const {
		name,
		title,
		username,
		password,
		code,
		hourlyRate,
		clockIn,
		clockOut,
	} = req.body;

	let employee: Employee = {
		name,
		title,
		username,
		password,
		code,
		hourlyRate,
		workHours: { clockIn, clockOut },
	};

	const { value, error } = EmployeeSchema.fork("password", (schema) =>
		schema.optional()
	).validate(employee);
	// * Here I modified the Schema, so it won't check for a password
	if (error) {
		res.status(400).send({ message: error.message });
		return;
	} else {
		employee = value;
	}

	try {
		// * please notice that you have a database index on `code` that forces it to be unique
		const { code, hourlyRate, name, title, username, workHours } = employee;
		await COLLECTIONS.employees.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { code, hourlyRate, name, title, username, workHours } }
		);
		res.status(201).redirect(`/employee/${id}`);
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}

// POST /employee/updatePassword/:id
export async function updateEmployeePassword(
	req: Request<
		{ id: string },
		{},
		{
			oldPassword: string;
			newPassword: string;
			repeatedNewPassword: string;
		}
	>,
	res: Response
) {
	const { oldPassword, newPassword, repeatedNewPassword } = req.body;
	const id = req.params.id;

	let currentPasswordInDatabase;

	if (newPassword !== repeatedNewPassword) {
		res.status(400).send({ message: "new password doesn't match" });
		return;
	}

	try {
		const result = await COLLECTIONS.employees.findOne(
			{ _id: new ObjectId(id) },
			{ projection: { password: 1, _id: 0 } } // ? is it necessary at this point ?
		);
		if (!result) {
			res.status(404).send({ message: "Employee not found" });
			return;
		} else {
			currentPasswordInDatabase = result.password;
		}
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
		return;
	}

	try {
		const result = await bcrypt.compare(oldPassword, currentPasswordInDatabase);
		if (!result) {
			res.status(400).send({ message: "Old Password is wrong" });
			return;
		}

		const salt = await generateSalt();
		const newHashedPassword = await bcrypt.hash(newPassword, salt);

		await COLLECTIONS.employees.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { password: newHashedPassword } }
		);
		res.status(201).redirect(`/employee/${id}`);
	} catch (e) {
		res.status(500).send({ message: (e as Error).message });
		return;
	}
}

// DELETE /employee/:id
export async function deleteEmployee(
	req: Request<{ id: string }>,
	res: Response<{ message: string }>
) {
	const id: string = req.params.id;
	try {
		const { deletedCount } = await COLLECTIONS.employees.deleteOne({
			_id: new ObjectId(id),
		});
		if (deletedCount !== 1) {
			res.status(404).send({ message: "Employee not found" });
			return;
		}
		res.status(200).send({ message: "deletion succeeded" });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}
