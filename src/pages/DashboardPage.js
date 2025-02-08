import React, { useState, useEffect } from "react";
import { getFullUser, getMonthNamesApi, getMonthByName, createMonthApi } from "../api/AxiosService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../Auth/AuthContext";
import TopFiveExpenses from "../components/expense/TopFiveExpenses";
import { FaMoneyBillWave, FaShoppingCart, FaWallet } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";


const DashboardPage = () => {

  const { userDetails, setCurrentMonth, currentMonth, setListOfAvailableMonths, listOfAvailableMonths, setUserDetails } = useAuth();
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [monthNames, setMonthNames] = useState([]);
  const [summary, setSummary] = useState({ earnings: 0, expenses: 0, balance: 0 });
  const [spendingPercentage, setSpendingPercentage] = useState(0);

  const monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const yearList = ["2025", "2026", "2027", "2028"];

  useEffect(() => {
    console.log("month name " + currentMonth + " type " + typeof (currentMonth))
    fetchDetails({ month: currentMonth })
  }, [])

  const fetchDetails = async (values) => {
    try {
      console.log("valeus " + JSON.stringify(values))
      await getFullUser(userDetails.userId).then((response) => {
        console.log("respone ==== " + JSON.stringify(response.data))
        // setCurrentMonth(values.month)
        response.data.months.length > 0 && updateSummary(response.data.months.filter(month => month.name === values.month)[0].expenses,
          response.data.months.filter(month => month.name === values.month)[0].earning)
      })
    } catch (error) {
      console.error("Failed to fetch amount:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = (updatedExpenses, earning) => {
    const totalExpenses = updatedExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const totalEarnings = earning;
    setSummary({
      earnings: totalEarnings,
      expenses: totalExpenses,
      balance: totalEarnings - totalExpenses,
    });
    console.log("update summary " + JSON.stringify(summary))
    setSpendingPercentage((totalExpenses / totalEarnings) * 100);
  };

  useEffect(() => {
    const fetchMonthNames = async () => {
      try {
        await getMonthNamesApi(userDetails.userId).then((response) => {
          setListOfAvailableMonths(response.data);
          console.log("name list " + listOfAvailableMonths)
        });
      } catch (error) {
        console.error("Failed to fetch amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthNames();
    // fetchDetails({month: currentMonth});
  }, [userDetails.userId, currentMonth]);

  // const handleAddMonth = async (values, { resetForm }) => {
  //   try {
  //     const monthReq = {
  //       name: values.month + "," + values.year,
  //       earning: values.earning,
  //       userId: userDetails.userId
  //     };

  //     await createMonthApi(monthReq).then((response) => {
  //       setCurrentMonth(monthReq.name);
  //     });
  //     resetForm();
  //   } catch (error) {
  //     console.error("Failed to add month:", error);
  //     alert("Failed to add month. Please try again.");
  //   }
  // };

  return (
    <div className="container mt-5">

      {/* Header Section */}
      <h2 className="text-center mb-4">{currentMonth} Monthly Dashboard</h2>

      {/* Month Selector Form */}
      <Formik
        initialValues={{ month: "" }}
        onSubmit={values => fetchDetails(values)}
      >
        {() => (
          // <Form className="mb-4">
          //   <div className="form-group ">
          //     <label htmlFor="month" className="form-label col-md-4">Select Month</label>
          //     <Field as="select" id="month" name="month col-md-4" className="form-control">
          //       <option value="" className="col-md-4">-- Select a month --</option>
          //       {listOfAvailableMonths.map((month, index) => (
          //         <option key={index} value={month}>{month}</option>
          //       ))}
          //     </Field>
          //   </div>
          //   <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
          // </Form>
          <Form className="mb-4 d-flex align-items-center gap-3">
            <div className="form-group mb-0">
              <label htmlFor="month" className="form-label me-2">Select Month:</label>
              <Field as="select" id="month" name="month" className="form-control d-inline-block w-auto">
                <option value="">-- Select a month --</option>
                {listOfAvailableMonths.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </Field>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </Form>

        )}
      </Formik>

      {/* Summary Section */}
      {/* <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="card-title">Earnings</h5>
            <p className="card-text">₹{summary.earnings.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="card-title">Expenses</h5>
            <p className="card-text">₹{summary.expenses.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="card-title">Balance</h5>
            <p className="card-text">₹{summary.balance.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div> */}

      <h3>Expense Bar</h3>
      <ProgressBar now={spendingPercentage} label={`${spendingPercentage.toFixed(1)}%`} className="mb-4" />

      <div className="row mb-4 d-flex justify-content-center gap-3">
        <div className="col-md-3 col-sm-6">
          <div className="card shadow-lg p-4 text-white bg-success rounded-3">
            <div className="d-flex align-items-center">
              <FaMoneyBillWave size={30} className="me-3" />
              <h5 className="card-title mb-0">Earnings</h5>
            </div>
            <p className="card-text mt-2 fs-4 fw-bold">₹{summary.earnings.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-lg p-4 text-white bg-danger rounded-3">
            <div className="d-flex align-items-center">
              <FaShoppingCart size={30} className="me-3" />
              <h5 className="card-title mb-0">Expenses</h5>
            </div>
            <p className="card-text mt-2 fs-4 fw-bold">₹{summary.expenses.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card shadow-lg p-4 text-white bg-primary rounded-3">
            <div className="d-flex align-items-center">
              <FaWallet size={30} className="me-3" />
              <h5 className="card-title mb-0">Balance</h5>
            </div>
            <p className="card-text mt-2 fs-4 fw-bold">₹{summary.balance.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Top Five Expenses Section */}
      <TopFiveExpenses />

      {/* Add New Month Section */}
      {/* <div className="mt-5">
        <h4>Add New Month</h4>
        <Formik
          initialValues={{ month: "", year: "", earning: 0 }}
          onSubmit={handleAddMonth}
        >
          <Form className="row g-3">
            <div className="col-md-4">
              <label htmlFor="month" className="form-label">Select Month</label>
              <Field as="select" id="month" name="month" className="form-control">
                <option value="">-- Select a month --</option>
                {monthList.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </Field>
            </div>

            <div className="col-md-4">
              <label htmlFor="year" className="form-label">Select Year</label>
              <Field as="select" id="year" name="year" className="form-control">
                <option value="">-- Select a year --</option>
                {yearList.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </Field>
            </div>

            <div className="col-md-4">
              <label htmlFor="earning" className="form-label">Add Earnings</label>
              <Field name="earning" id="earning" className="form-control" placeholder="Enter amount" />
            </div>

            <div className="col-md-12 mt-3">
              <button type="submit" className="btn btn-success w-100">Add Month</button>
            </div>
          </Form>
        </Formik>
      </div> */}

    </div>
  );
};

export default DashboardPage;
