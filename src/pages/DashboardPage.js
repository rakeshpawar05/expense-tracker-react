import React, { useState, useEffect } from "react";
import { getAmountApi, getMonthNamesApi, getMonthByName , createMonthApi} from "../api/AxiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../Auth/AuthContext";
import TopFiveExpenses from "../components/expense/TopFiveExpenses";

const DashboardPage = () => {

  const { userDetails, setCurrentMonth, currentMonth } = useAuth();
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthNames, setMonthNames] = useState([]);
  const [summary, setSummary] = useState({ earnings: 0, expenses: 0, balance: 0 });

  const monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const yearList = ["2025", "2026", "2027", "2028"];

  // useEffect(() => {
  const fetchDetails = async (values) => {
    try {
      await getMonthByName(values.month).then((response) => {
        // setAmount(response.data);
        console.log("month " + JSON.stringify(response.data))
        console.log("earnings " + response.data.expenses.reduce((acc, expense) => acc + Number(expense.amount), 0))
        // response.data.expenses.map( expense => expense.amount).sum();
        setCurrentMonth(response.data.name)
        updateSummary(response.data.expenses, response.data.earning);
        console.log("done")
      })
    } catch (error) {
      console.error("Failed to fetch amount:", error);
    } finally {
      setLoading(false);
    }
  };
  // fetchAmount();
  // }, []);

  // Function to update the summary
  const updateSummary = (updatedExpenses, earning) => {
    const totalExpenses = updatedExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalEarnings = earning; // Replace with actual earnings logic or fetch from API
    setSummary({
      earnings: totalEarnings,
      expenses: totalExpenses,
      balance: totalEarnings - totalExpenses,
    });
  };

  useEffect(() => {
    const fetchMonthNames = async () => {
      try {
        console.log("fetching month names for user id " + userDetails.userId)
        await getMonthNamesApi(userDetails.userId).then((response) => {
          console.log("names " + response.data)
          setMonthNames(response.data);
        })
      } catch (error) {
        console.error("Failed to fetch amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthNames();
  }, [userDetails.userId, currentMonth]);

  // Function to add a new month
  const handleAddMonth = async (values, { resetForm }) => {
    try {
      // const response = await axios.post(`${API_BASE_URL}/months`, values);
      // setMonths([...months, response.data]); // Assuming response contains the added month
      console.log("adding month " + JSON.stringify(values));
      const monthReq = {
        name: values.month + "," + values.year,
        earning: values.earning,
        userId: userDetails.userId
      }

      await createMonthApi(monthReq).then((response) => {
        console.log("month created with id " + response.data)
        // setMonthNames(response.data);
        setCurrentMonth(monthReq.name)
      })
      resetForm();
    } catch (error) {
      console.error("Failed to add month:", error);
      alert("Failed to add month. Please try again.");
    }
  };

  // return (
  //   <div className="container mt-4">
  //     <h1 className="mb-4">Dashboard</h1>
  //     <div className="row">
  //       <div className="col-md-6">
  //         <div className="card p-3 shadow-sm">
  //           <h4>Total Earnings</h4>
  //           <p>$5,000</p>
  //         </div>
  //       </div>
  //       <div className="col-md-6">
  //         <div className="card p-3 shadow-sm">
  //           <h4>Total Expenses</h4>
  //           <p>{amount}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="container mt-5">

      <div className="container mt-5">
        <h2>Monthly DashBoard</h2>
        <Formik
          initialValues={{
            month: "", // Initial value for the dropdown
          }}
          onSubmit={values => fetchDetails(values)}
        >
          {() => (
            <Form>
              <div className="mb-3">
                <label htmlFor="month" className="form-label">
                  Select Month
                </label>
                <Field
                  as="select"
                  id="month"
                  name="month"
                  className="form-control"
                >
                  <option value="">-- Select an option --</option>
                  {monthNames.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </Field>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Summary Section */}
      <div className="row mb-4 pt-3">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Earnings</h5>
            {<p>₹{(summary.earnings).toLocaleString('en-IN')}</p>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Expenses</h5>
            {<p>₹{(summary.expenses).toLocaleString('en-IN')}</p>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Balance</h5>
            {<p>₹{(summary.balance).toLocaleString('en-IN')}</p>}
          </div>
        </div>
      </div>

      <TopFiveExpenses />

      {/* Add New Month Section */}
      {/* <div className="mb-4">
        <h4>Add New Month</h4>
        <Formik
          initialValues={{ month: "", year: "", earning: 0 }}
          onSubmit={handleAddMonth}
        >
          <Form className="d-flex">
            <label htmlFor="month" className="form-label">
              Select Month
            </label>
            <Field
              as="select"
              id="month"
              name="month"
              className="form-control"
            >
              <option value="">-- Select a month --</option>
              {monthList.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </Field>

            <label htmlFor="year" className="form-label">
              Select Year
            </label>
            <Field
              as="select"
              id="year"
              name="year"
              className="form-control"
            >
              <option value="">-- Select a year --</option>
              {yearList.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Field>

            <label htmlFor="earning" className="form-label">
              Add Earnings
            </label>
            <Field name="earning" id="earning" className="form-control me-2" placeholder="Enter amount" />

            <button type="submit" className="btn btn-primary">Add Month</button>
          </Form>
        </Formik>
      </div> */}

      {/* Add Expense Section */}
      {/* <div className="mb-4">
        <h4>Add Expense</h4>
        <Formik
          initialValues={{}}
        // onSubmit={handleAddExpense}
        >
          <Form className="row g-3">
            <div className="col-md-3">
              <Field name="name" className="form-control" placeholder="Expense Name" />
            </div>
            <div className="col-md-3">
              <Field name="category" as="select" className="form-control">
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </Field>
            </div>
            <div className="col-md-2">
              <Field name="amount" type="number" className="form-control" placeholder="Amount" />
            </div>
            <div className="col-md-2">
              <Field name="date" type="date" className="form-control" />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">Add Expense</button>
            </div>
          </Form>
        </Formik>
      </div> */}

      {/* Expense List Section */}
      {/* <div>

        <h4>Expense List for {currentMonth || "Selected Month"}</h4>
        {expenses.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.id}</td>
                  <td>{exp.name}</td>
                  <td>{exp.category}</td>
                  <td>${exp.amount}</td>
                  <td>{exp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div> */}
    </div>
  );
};

export default DashboardPage;