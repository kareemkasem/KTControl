import { ObjectId, WithId } from "mongodb";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Employee, EmployeeFormInput, WorkHours } from "../types";
import { EmployeeColl, EmployeeSchema } from "../models/Employee";
import { generateSalt } from "../utils/generateSalt";

// Get /employee/:id
// TODO: testing: Passed ✅
export async function getEmployee(req: Request<{ id: string }>, res: Response<WithId<Employee> | { message: string }>) {
	const id: string = req.params.id;
	try {
		const result = await EmployeeColl.findOne<WithId<Employee>>({
			_id: new ObjectId(id),
		});
		if (!result) {
			res.status(404).send({ message: "Employee not found" });
			return;
		}
		res.status(200).send(result);
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}

// GET /employee
// TODO: testing: Passed ✅
export async function getAllEmployees(req: Request, res: Response) {
	try {
		const employees = await EmployeeColl.find<WithId<Employee>>({}).toArray();
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
// TODO: testing: Passed ✅
export async function createEmployee(req: Request<{}, {}, EmployeeFormInput>, res: Response) {
	const { name, title, username, password, code, hourlyRate, clockIn, clockOut } = req.body;
	let employee: Employee = { name, title, username, password, code, hourlyRate, workHours: { clockIn, clockOut } };

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
		await EmployeeColl.insertOne(employee);
		res.status(201).redirect("/employee");
	} catch (e) {
		res.status(400).send({ message: `from mongo: ${(e as Error).message}` });
	}
}

// PUT /employee/:id
// TODO: testing: Passed ✅
export async function updateEmployee(req: Request<{ id: string }, {}, Employee>, res: Response<{ message: string }>) {
	// * for more atomization, this Function does NOT change password
	let id = req.params.id;
	let employee = req.body;

	const { value, error } = EmployeeSchema.validate(employee);
	if (error) {
		res.send({ message: error.message });
		return;
	} else {
		employee = value;
	}

	try {
		// * please notice that you have a database index on `code` that forces it to be unique
		const { code, hourlyRate, name, title, username, workHours } = employee;
		await EmployeeColl.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { code, hourlyRate, name, title, username, workHours } }
		);
		res.status(201).send({ message: "update success" });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}

// PUT /employee/updatePassword/:id
// TODO: testing: Passed ✅
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
		const result = await EmployeeColl.findOne(
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
		console.log(oldPassword, " ", currentPasswordInDatabase);
		const result = await bcrypt.compare(oldPassword, currentPasswordInDatabase);
		console.log(result);
		if (!result) {
			res.status(400).send({ message: "old password is wrong" });
			return;
		}

		let salt: string;
		try {
			salt = await generateSalt();
		} catch (e) {
			res.status(400).send({ message: (e as Error).message });
			return;
		}
		const newhashedPassword = await bcrypt.hash(newPassword, salt);

		const {} = await EmployeeColl.updateOne({ _id: new ObjectId(id) }, { $set: { password: newhashedPassword } });
		res.status(201).send({ message: "password updated" });
	} catch (e) {
		res.status(500).send({ message: (e as Error).message });
		return;
	}
}

// DELETE /employee/:id
// TODO: testing: Passed ✅
export async function deleteEmployee(req: Request<{ id: string }>, res: Response<{ message: string }>) {
	const id: string = req.params.id;
	try {
		const result = await EmployeeColl.findOne<WithId<Employee>>({
			_id: new ObjectId(id),
		});
		if (!result) {
			res.status(404).send({ message: "Employee not found" });
			return;
		}
		await EmployeeColl.deleteOne({ _id: new ObjectId(id) });
		res.status(200).send({ message: "Employee deleted" });
	} catch (e) {
		res.status(400).send({ message: (e as Error).message });
	}
}