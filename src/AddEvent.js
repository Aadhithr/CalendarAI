import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './App.css';

function AddEvent({ onAddEvent }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Add Event</h1>
      <Formik
        initialValues={{
          title: '',
          start: '',
          end: '',
          priority: '',
          description: '',
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Required'),
          start: Yup.date().required('Required'),
          end: Yup.date().required('Required'),
          priority: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
        
            // Save the new event to local storage
            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.push({
                title: values.title,
                start: new Date(values.start),
                end: new Date(values.end),
                allDay: false,
                resource: "Work",
                priority: values.priority,
                description: values.description,
            });
            localStorage.setItem('events', JSON.stringify(events));
        
            // navigate back to home page (calendar view)
            navigate('/');
        
            setSubmitting(false);
        }}
        
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" />

            <label htmlFor="start">Start Date and Time</label>
            <Field name="start" type="datetime-local" />
            <ErrorMessage name="start" component="div" />

            <label htmlFor="end">End Date and Time</label>
            <Field name="end" type="datetime-local" />
            <ErrorMessage name="end" component="div" />

            <label htmlFor="priority">Priority</label>
            <Field name="priority" as="select">
              <option value="">Select a priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Field>
            <ErrorMessage name="priority" component="div" />

            <label htmlFor="description">Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Save Event
            </button>

            <button type="button" className="back-btn" onClick={() => navigate('/')}>
              Back
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddEvent;
