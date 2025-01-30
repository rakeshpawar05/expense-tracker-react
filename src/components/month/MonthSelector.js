import React from "react";
import { useAuth } from "../../Auth/AuthContext";

const MonthSelector = () => {

    const {listOfAvailableMonths} = useAuth();

    return (
        <div>
            {/* Month Selector Form */}
            <Formik
                initialValues={{ month: "" }}
                onSubmit={values => fetchDetails(values)}
            >
                {() => (
                    <Form className="mb-4">
                        <div className="form-group">
                            <label htmlFor="month" className="form-label">Select Month</label>
                            <Field as="select" id="month" name="month" className="form-control">
                                <option value="">-- Select a month --</option>
                                {listOfAvailableMonths.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </Field>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MonthSelector;