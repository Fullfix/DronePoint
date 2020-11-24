import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Row, Col, Table, Button, CardTitle } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { v4 } from "uuid";
import {
  companySchema,
  educationSchema,
  identitySchema,
  personnelSchema,
  contactSchema,
} from "./schemas";
import IdCheck from './Individual_Forms/IDCheck'
toast.configure();
const Individual = () => {
  const [check, setCheck] = useState([]);
  console.log('TEST')

  // To reference the personnel and contact]
  const personnelForm = useRef();
  const contactForm = useRef();
  const educationForm = useRef();
  const employeeForm = useRef();
  const identityForm = useRef();
  const [uploading, setUploading] = useState(false);
  const [personnelDetails, setPersonnelDetails] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [educationDetail, setEducationDetail] = useState([]);
  const [
    employmentVerificationDetail,
    setEmploymentVerificationDetail,
  ] = useState([]);
  const [identityVerificationDetail, setIdentityVerificationDetail] = useState(
    [],
  );
  useEffect(() => {
    const uploadIndividual = async () => {
      try {
        console.log(contactDetails);
        const res = await axios.post("/evfs", {
          personnelDetails: personnelDetails,
          contactDetails: contactDetails,
          educationDetails: educationDetail.map(details => {
            return {
              ...details,
              document: undefined,
              document_name: undefined,
            }
          }),
          employmentVerificationDetails: employmentVerificationDetail.map(details => {
            return {
              ...details,
              document: undefined,
              document_name: undefined,
            }
          }),
          identityVerificationDetails: identityVerificationDetail.map(details => {
            return {
              ...details,
              document: undefined,
              document_name: undefined,
            }
          }),
        });
        console.log(res.data);
        const formdata = new FormData();
        educationDetail.forEach((details, i) => {
          formdata.append(`educationDetails${i}`, details.document);
        });
        employmentVerificationDetail.forEach((details, i) => {
          formdata.append(`employmentVerificationDetails${i}`, details.document);
        });
        identityVerificationDetail.forEach((details, i) => {
          formdata.append(`identityVerificationDetails${i}`, details.document);
        });
        formdata.append('id', res.data._id);
        const res2 = await axios.post('/evfs/files', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(res2.data);
        toast.info("inserted successfully 2", { autoClose: 2000 });
        setUploading(false);
      } catch (err) {
        toast.warn("cannot insert data 2", { autoClose: 2000 });
        setUploading(false);
      }
    };
    if (uploading) {
      uploadIndividual();
    }
  })
  return (
    <>
      <div className="my-3">
        <p style={{ fontSize: "24px" }}>Employee Verification Form</p>
        <Card>
          <CardBody>
            <AvForm
              onValidSubmit={e => {
                console.log('FORM SUBMITTED');
                contactForm.current.handleSubmit();
                personnelForm.current.handleSubmit();
                setUploading(true);
              }}
              // onValidSubmit={async e => {
              //   e.preventDefault();
              //   contactForm.current.handleSubmit();
              //   personnelForm.current.handleSubmit();
              //   educationForm.current.handleSubmit();
              //   employeeForm.current.handleSubmit();
              //   identityForm.current.handleSubmit()
              //   // Need an API to submit details
              //   const values = {
              //     personnel:personnelDetails,
              //     contact:contactDetails,
              //     education:educationDetail,
              //     employment:employmentVerificationDetail,
              //     identity:identityVerificationDetail
                
              //   }
              //   console.log(values)
              //   axios
              //   .post("/file/upload/single", values)
              //   .then(_ => {
              //     toast.info("inserted successfully", { autoClose: 2000 });
              //   })
              //   .catch(err => {
              //     toast.warn("cannot insert data", { autoClose: 2000 });
              //   });
              // }}
            >
              <h3 className="my-1">Personal Information:</h3>
                            <Formik
                initialValues={{
                  reference_no: "",
                  employer_id: "",
                  contact_no: "",
                  first_name: "",
                  middle_name: "",
                  last_name: "",
                  father_name: "",
                  dateofbirth: "",
                  gender: "",
                  marital_status: "",
                  nationality: "",
                  alternate_contact: "",
                  email_id: "",
                }}
                validationSchema={personnelSchema}
                onSubmit={(values, { resetForm }) => {
                  console.log('RESET');
                  setPersonnelDetails({ ...values });
                  console.log(personnelDetails);
                  resetForm({});
                }}
                innerRef={personnelForm}
              >
                {({ errors }) => (
                  <Row>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        name="reference_no"
                        label="Reference No."
                        placeholder="Leave Blank"
                        invalid={!!errors.reference_no}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="employer_id"
                        label="Employer ID"
                        placeholder="Leave Blank"
                        invalid={!!errors.employer_id}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="contact_no"
                        label="Contact Number"
                        placeholder="Your Mobile Number"
                        invalid={!!errors.contact_no}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="first_name"
                        label="First Name"
                        invalid={!!errors.first_name}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="middle_name"
                        label="Middle Name"
                        invalid={!!errors.middle_name}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="last_name"
                        label="Last Name"
                        invalid={!!errors.last_name}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="father_name"
                        label="Father Name"
                        invalid={!!errors.father_name}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="dateofbirth"
                        label="Date of Birth."
                        type="date"
                        invalid={!!errors.dateofbirth}
                      />
                    </Col>
                    <Col md={4} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="gender"
                        label="Gender"
                        type="select"
                        invalid={!!errors.gender}
                      >
                        <option>Select an Option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender">Transgender</option>
                      </Field>
                    </Col>

                    <Col md={3} sm={6}>
                      <Field
                        as={AvField}
                        d
                        name="marital_status"
                        label="Marital status"
                        invalid={!!errors.marital_status}
                      />
                    </Col>
                    <Col md={3} sm={6}>
                      <Field
                        as={AvField}
                        name="nationality"
                        label="Nationality"
                        invalid={!!errors.nationality}
                      />
                    </Col>
                    <Col md={3} sm={6}>
                      <Field
                        as={AvField}
                        name="alternate_contact"
                        label="Alternate Contact Number"
                        invalid={!!errors.alternate_contact}
                      />
                    </Col>
                    <Col md={3} sm={6}>
                      <Field
                        as={AvField}
                        name="email_id"
                        label="email id"
                        invalid={!!errors.email_id}
                      />
                    </Col>
                  </Row>
                )}
              </Formik>

              <h3 className="my-1">Contact Details:</h3>
              <Formik
                initialValues={{
                  permanent_address: "",
                  pin_code: "",
                  district: "",
                  state: "",
                  start_of_stay: "",
                  end_of_stay: "",
                  current_address: "",
                  current_pin_code: "",
                  current_district: "",
                  current_state: "",
                  current_start_of_stay: "",
                  current_end_of_stay: "",
                  previous_address: "",
                  previous_pin_code: "",
                  previous_district: "",
                  previous_state: "",
                  previous_start_of_stay: "",
                  previous_end_of_stay: "",
                  past_address: "",
                  past_pin_code: "",
                  past_district: "",
                  past_state: "",
                  past_start_of_stay: "",
                  past_end_of_stay: "",
                }}
                validationSchema={contactSchema}
                onSubmit={(values, { resetForm }) => {
                  console.log('FORM SUBUT')
                  setContactDetails({ ...values });
                  console.log(values);
                  console.log(contactDetails);
                  resetForm({});
                }}
                innerRef={contactForm}
              >
                {({ errors }) => {
                  return (
                  <Form>
                    <Row>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="permanent_address"
                          label="Permanent Address"
                          invalid={!!errors.permanent_address}
                        />
                      </Col>
                      <Col md={1} sm={6}>
                        <Field
                          as={AvField}
                          name="pin_code"
                          label="Pin Code"
                          invalid={!!errors.pin_code}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="district"
                          label="District"
                          invalid={!!errors.district}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="state"
                          label="State"
                          invalid={!!errors.state}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="start_of_stay"
                          label="Perod of Stay"
                          placeholder="Staying From"
                          type="date"
                          invalid={!!errors.start_of_stay}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="end_of_stay"
                          label="Perod of Stay"
                          placeholder="Staying Till"
                          type="date"
                          invalid={!!errors.end_of_stay}
                        />
                      </Col>

                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="current_address"
                          label="Current Address"
                          invalid={!!errors.current_address}
                        />
                      </Col>
                      <Col md={1} sm={6}>
                        <Field
                          as={AvField}
                          name="current_pin_code"
                          label="Pin Code"
                          invalid={!!errors.current_pin_code}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="current_district"
                          label="District"
                          invalid={!!errors.current_district}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="current_state"
                          label="State"
                          invalid={!!errors.current_state}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="current_start_of_stay"
                          label="Period of Stay"
                          placeholder="Staying From"
                          type="date"
                          invalid={!!errors.current_start_of_stay}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="current_end_of_stay"
                          label="Perod of Stay"
                          placeholder="Staying Till"
                          type="date"
                          invalid={!!errors.current_end_of_stay}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_address"
                          label="Previous Address"
                          invalid={!!errors.previous_address}
                        />
                      </Col>
                      <Col md={1} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_pin_code"
                          label="Pin Code"
                          invalid={!!errors.previous_pin_code}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_district"
                          label="District"
                          invalid={!!errors.previous_district}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_state"
                          label="State"
                          invalid={!!errors.previous_state}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_start_of_stay"
                          label="Perod of Stay"
                          placeholder="Staying From"
                          type="date"
                          invalid={!!errors.previous_start_of_stay}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="previous_end_of_stay"
                          label="Perod of Stay"
                          placeholder="Staying Till"
                          type="date"
                          invalid={!!errors.previous_end_of_stay}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="past_address"
                          label="Past Address"
                          invalid={!!errors.past_address}
                        />
                      </Col>
                      <Col md={1} sm={6}>
                        <Field
                          as={AvField}
                          name="past_pin_code"
                          label="Pin Code"
                          invalid={!!errors.past_pin_code}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="past_district"
                          label="District"
                          invalid={!!errors.past_district}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="past_state"
                          label="State"
                          invalid={!!errors.past_state}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="past_start_of_ stay"
                          label="Period of Stay"
                          placeholder="Staying From"
                          type="date"
                          invalid={!!errors.past_start_of_stay}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="past_end_of_ stay"
                          label="Perod of Stay"
                          placeholder="Staying Till"
                          type="date"
                          invalid={!!errors.past_end_of_stay}
                        />
                      </Col>
                    </Row>
                  </Form>
                )}}
              </Formik>
              <h3 className="my-1">Education Details:</h3>
              <Formik
                initialValues={{
                  institute_name: "",
                  location: "",
                  roll_or_reg: "",
                  course: "",
                  course_begin_year: "",
                  year_of_passing: "",
                  class_or_percentage: "",
                  university_board_name: "",
                  document: "",
                  document_name: "",
                }}
                innerRef={educationForm}
                validationSchema={educationSchema}
                onSubmit={(values, { resetForm }) => {
                  setEducationDetail(prevData => {
                    return [...prevData, { ...values, id: v4() }];
                  });
                  resetForm({});
                }}
              >
                {({ submitForm, setFieldValue, errors }) => (
                  <Form>
                    <Row>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="institute_name"
                          label="Institute Name"
                          invalid={!!errors.institute_name}
                        ></Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="location"
                          label="Location"
                          invalid={!!errors.location}
                        ></Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="roll_or_reg"
                          label="Roll / Reg Number"
                          invalid={!!errors.roll_or_reg}
                        ></Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="course"
                          label="Course"
                          invalid={!!errors.course}
                        ></Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="course_begin_year"
                          type="date"
                          label="Course Begin Year"
                          invalid={!!errors.course_begin_year}
                        ></Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="year_of_passing"
                          type="date"
                          label="Year Of Passing"
                          invalid={!!errors.year_of_passing}
                        ></Field>
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="class_or_percentage"
                          label="Class / Percentage"
                          invalid={!!errors.class_or_percentage}
                        ></Field>
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="university_board_name"
                          label="University Board Name"
                          invalid={!!errors.university_board_name}
                        ></Field>
                      </Col>

                      <Col
                        md={3}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Field
                          name="file"
                          type="file"
                          label="Documents"
                          onChange={e => {
                            e.preventDefault();
                            setFieldValue("document", e.currentTarget.files[0]);
                            setFieldValue(
                              "document_name",
                              e.currentTarget.files[0].name,
                            );
                          }}
                        />
                      </Col>
                      <Col
                        md={3}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Add More"
                          style={{ height: "40px" }}
                          onClick={e => {
                            e.preventDefault();
                            submitForm();
                          }}
                        />
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              {educationDetail.length > 0 ? (
                <Card>
                  <CardBody>
                    <Table className="no-wrap v-middle" responsive hover>
                      <thead>
                        <tr>
                          <th>Institute Name</th>
                          <th>Location</th>
                          <th>Roll / Reg Number</th>
                          <th>Course</th>
                          <th>Course Begin Year</th>
                          <th>Year Of Passing</th>
                          <th>Class or Percentage</th>
                          <td>University Board Name</td>
                          <th>Document Name</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educationDetail.map(d => (
                          <tr key={d.id}>
                            <td>{d.institute_name}</td>
                            <td>{d.location}</td>
                            <td>{d.roll_or_reg}</td>
                            <td>{d.course}</td>
                            <td>{d.course_begin_year}</td>
                            <td>{d.year_of_passing}</td>
                            <td>{d.class_or_percentage}</td>
                            <td>{d.university_board_name}</td>
                            <td>{d.document_name}</td>
                            <td>
                              <Button
                                color="danger"
                                onClick={() => {
                                  const data = educationDetail.filter(
                                    e => e.id !== d.id,
                                  );
                                  setEducationDetail(data);
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              ) : (
                ""
              )}
              <h3 className="my-1">Employment verification Details:</h3>
              <Formik
                initialValues={{
                  company_name: "",
                  company_address: "",
                  company_pin_code: "",
                  company_district: "",
                  company_state: "",
                  company_salary: "",
                  company_reason_for_leaving: "",
                  company_designation: "",
                  company_start_date: "",
                  company_end_date: "",
                  comapny_employee_id: "",
                  company_supervisor_name: "",
                  company_supervisor_email: "",
                  company_supervisor_contact: "",
                  company_hr_email: "",
                  document: "",
                  document_name: "",
                }}
                innerRef={employeeForm}
                validationSchema={companySchema}
                onSubmit={(values, { resetForm }) => {
                  setEmploymentVerificationDetail(prevData => [
                    ...prevData,
                    { ...values, id: v4() },
                  ]);
                  resetForm({});
                }}
              >
                {({ setFieldValue, errors, submitForm }) => (
                  <Form>
                    <Row>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_name"
                          label="Company Name"
                          invalid={!!errors.company_name}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="company_address"
                          label="Company Address"
                          invalid={!!errors.company_address}
                        />
                      </Col>
                      <Col md={1} sm={6}>
                        <Field
                          as={AvField}
                          name="company_pin_code"
                          label="Pin Code"
                          invalid={!!errors.company_pin_code}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="company_district"
                          label="District"
                          invalid={!!errors.company_district}
                        />
                      </Col>
                      <Col md={2} sm={6}>
                        <Field
                          as={AvField}
                          name="company_state"
                          label="State"
                          invalid={!!errors.company_state}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_salary"
                          label="Salary"
                          invalid={!!errors.company_salary}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_reason_for_leaving"
                          label="Reason For Leaving"
                          invalid={!!errors.company_reason_for_leaving}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_designation"
                          label="Designation"
                          invalid={!!errors.company_designation}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_start_date"
                          label="From Date"
                          type="date"
                          invalid={!!errors.company_start_date}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_end_date"
                          label="To Date"
                          type="date"
                          invalid={!!errors.company_end_date}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="company_employee_id"
                          label="Employee Id"
                          invalid={!!errors.company_employee_id}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="company_supervisor_name"
                          label="Supervisor name"
                          invalid={!!errors.company_supervisor_name}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="company_supervisor_email"
                          label="Supervisor Email"
                          invalid={!!errors.company_supervisor_email}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="company_supervisor_contact"
                          label="Supervisor Contact"
                          invalid={!!errors.company_supervisor_contact}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="company_hr_email"
                          label="HR Email"
                          invalid={!!errors.company_hr_email}
                        />
                      </Col>
                      <Col
                        md={4}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <AvField
                          type="file"
                          name="documents"
                          label="Documents"
                          onChange={e => {
                            setFieldValue("document", e.currentTarget.files[0]);
                            setFieldValue(
                              "document_name",
                              e.currentTarget.files[0].name,
                            );
                          }}
                        ></AvField>
                      </Col>
                      <Col
                        md={4}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Add More"
                          style={{ height: "40px" }}
                          onClick={e => {
                            e.preventDefault();
                            submitForm();
                          }}
                        />
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
              {employmentVerificationDetail.length > 0 ? (
                <Card>
                  <CardBody>
                    <Table className="no-wrap v-middle" responsive hover>
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Company Address</th>
                          <th>Company District</th>
                          <th>Company State</th>
                          <th>Company Salary</th>
                          <th>Company Reason For Living</th>
                          <th>Company Designation</th>
                          <td>Company Start Date</td>
                          <th>Company End Date</th>
                          <th>Company Employee Id</th>
                          <th>Company Supervisor Name</th>
                          <th>Company Supervisor Email</th>
                          <th>Company Supervisor Contact</th>
                          <th>Company HR Email</th>
                          <th>Document Name</th>
                          <td>Remove</td>
                        </tr>
                      </thead>
                      <tbody>
                        {employmentVerificationDetail.map(d => (
                          <tr key={d.id}>
                            <td>{d.company_name}</td>
                            <td>{d.company_address}</td>
                            <td>{d.company_district}</td>
                            <td>{d.company_state}</td>
                            <td>{d.company_salary}</td>
                            <td>{d.company_reason_for_leaving}</td>
                            <td>{d.company_designation}</td>
                            <td>{d.company_start_date}</td>
                            <td>{d.company_end_date}</td>
                            <td>{d.company_employee_id}</td>
                            <td>{d.company_supervisor_name}</td>
                            <td>{d.company_supervisor_email}</td>
                            <td>{d.company_supervisor_contact}</td>
                            <td>{d.company_hr_email}</td>
                            <td>{d.document_name}</td>
                            <td>
                              <Button
                                color="danger"
                                onClick={() => {
                                  const data = employmentVerificationDetail.filter(
                                    e => e.id !== d.id,
                                 setEmploymentVerificationDetail(data)
                                  )}}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              ) : (
                ""
              )}
              <h3 className="my-1">Identity Verification Details:</h3>
              <Formik
                initialValues={{
                  id_type: "",
                  id_number: "",
                  date_of_issue: "",
                  date_of_expiry: "",
                  place_of_issue: "",
                  document: "",
                  document_name: "",
                }}
                innerRef={identityForm}
                validationSchema={identitySchema}
                onSubmit={(values, { resetForm }) => {
                  setIdentityVerificationDetail(prev => [
                    ...prev,
                    { ...values, id: v4() },
                  ]);
                  resetForm();
                }}
              >
                {({ setFieldValue, submitForm, errors }) => (
                  <Form>
                    <Row>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="id_type"
                          label="ID Type"
                          type="select"
                          invalid={!!errors.id_type}
                        > 
                          <option>Select Option</option>
                          <option value="pan_card">Pan Card</option>
                          <option value="adhar">Adhar</option>
                          <option value="voter_id">Voter Id</option>
                          <option value="driving_licence">Driving Licence</option>
                          <option value="password">Passport</option>
                        </Field>
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="id_number"
                          label="ID Number"
                          invalid={!!errors.id_number}
                        />
                      </Col>
                      <Col md={4} sm={6}>
                        <Field
                          as={AvField}
                          name="date_of_issue"
                          label="Date Of Issue"
                          type="date"
                          // invalid={!!errors.date_of_issue}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="date_of_expiry"
                          label="Date Of Expiry"
                          type="date"
                          // invalid={!!errors.date_of_expiry}
                        />
                      </Col>
                      <Col md={3} sm={6}>
                        <Field
                          as={AvField}
                          name="place_of_issue"
                          label="Place Of Issue"
                          invalid={!!errors.place_of_issue}
                        />
                      </Col>
                      <Col
                        md={3}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Field
                          type="file"
                          name="file"
                          as={AvField}
                          label="Documents"
                          onChange={e => {
                            setFieldValue("document", e.currentTarget.files[0]);
                            setFieldValue(
                              "document_name",
                              e.currentTarget.files[0].name,
                            );
                          }}
                        ></Field>
                      </Col>
                      <Col
                        md={3}
                        sm={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Add More"
                          style={{ height: "40px" }}
                          onClick={e => {
                            e.preventDefault();
                            submitForm();
                          }}
                        />
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>

              {identityVerificationDetail.length > 0 ? (
                <Card>
                  <CardBody>
                    <Table className="no-wrap v-middle" responsive hover>
                      <thead>
                        <tr>
                          <th>ID Type</th>
                          <th>ID Number</th>
                          <th>Date Of Issue</th>
                          <th>Date Of Expiry</th>
                          <th>Place Of Issue</th>
                          <th>Document Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {identityVerificationDetail.map(d => (
                          <tr key={d.id}>
                            <td>{d.id_type}</td>
                            <td>{d.id_number}</td>
                            <td>{d.date_of_issue}</td>
                            <td>{d.date_of_expiry}</td>
                            <td>{d.place_of_issue}</td>
                            <td>{d.document_name}</td>
                            <td>
                              <Button
                                color="danger"
                                onClick={() => {
                                  const data = identityVerificationDetail.filter(
                                    e => e.id !== d.id,
                                  );
                                  setIdentityVerificationDetail(data);
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              ) : (
                ""
              )}
              {/* <h3 className="my-1">Information Verification:</h3>
              <IdCheck given={{date_time: '01-01-2020 13:29',
                              id_type: 'PAN CARD', 
                              id_number: 'ADIO34322', 
                              candidate_name: 'RAMESH KUMAR', 
                              father_name: 'KUMAR', 
                              address: 'DEMOD ADD', 
                              date_of_issue: 'N/A', 
                              date_of_expiry: 'N/A', 
                              place_of_issue: 'N/A',
                              submitted_document: 'Sample Document'}}
                        verified={{date_time: '01-01-2020 15:33',
                                  id_type: 'PAN CARD', 
                                  id_number: 'ADIO34322', 
                                  candidate_name: 'RAMESH KUMAR', 
                                  father_name: 'KUMAR', 
                                  address: 'DEMOD ADD', 
                                  date_of_issue: 'N/A', 
                                  date_of_expiry: 'N/A', 
                                  place_of_issue: 'N/A',
                                  submitted_document: 'Sample Document'}}
                /> */}
              <div>
                <input
                  type="submit"
                  className="mx-auto btn btn-primary"
                  value="Submit"
                />
              </div>
            </AvForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
export default Individual;

// Individual.js
// Displaying Individual.js.