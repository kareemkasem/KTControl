# KTCONTROL

ktcontrol enables employers to manage their personnel's incentives, bonuses, attendance and payroll among other aspects.
the app is specifically designed for
retail businesses.

The service is currently under development with an alpha expected within a month 👨‍💻

#### A note on how attendance works:

1. there's only one entry per day. if there's another attempt to clockIn on that day it has to be added as overtime
   by the admin
2. overnight shifts will be calculated on the day of the clockIn. you can safely clock out in a the next day
3. tardiness penalty will be calculated according to a factor specified by the admin that would apply to each minute
   if the employee exceeds a specific limit. for example; if the employee clockIn is supposed to be 03:30 pm, and he
   clocked In at 04:15 pm and the maximum limit for tardiness is 15 minutes and the factor is 1.5 then the penalty
   will be 45 minutes X 1.5 = 67.5 minutes which would then be calculated based on that employee hourly rate.
4. if the employee clocks out beyond his clockOut time by over a maximum set value (say 15 minutes) it will be added
   automatically as a "pending" overtime that has to be approved by the admin.
5. overtime is calculated in the same manner as tardiness.
6. overtime that isn't part of the shift has to be added manually.
7. Each employee has a set number of vacations per month (set by the admin). admin can always add in extra ones with
   or without pay.

#### Current TODO LIST:

* update employee model to add a vacation day
* implement authentication mechanism
* improve styling especially responsiveness
* improve error feedback for end user
