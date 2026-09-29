import { useEffect, useState } from 'react';

const emptyStudent = {
  admissionNo: '',
  studentName: '',
  dob: '',
  gender: '',
  fatherName: '',
};

const namePattern = /^[\p{L}][\p{L} .'-]{0,79}$/u;

function validate(values) {
  const errors = {};
  if (!values.admissionNo.trim()) errors.admissionNo = 'Admission number is required.';
  if (!namePattern.test(values.studentName.trim())) errors.studentName = 'Enter a valid name (letters, spaces, hyphens or apostrophes).';
  if (!values.dob || Number.isNaN(Date.parse(values.dob)) || values.dob >= new Date().toISOString().slice(0, 10)) {
    errors.dob = 'Enter a valid date before today.';
  }
  if (!['Male', 'Female', 'Other'].includes(values.gender)) errors.gender = 'Select a gender.';
  if (!namePattern.test(values.fatherName.trim())) errors.fatherName = "Enter a valid father's name.";
  return errors;
}

export default function StudentForm({ editingId, initialValues, onSubmit, onCancel, saving }) {
  const [values, setValues] = useState(emptyStudent);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues ? {
      admissionNo: initialValues.admissionNo,
      studentName: initialValues.studentName,
      dob: initialValues.dob.slice(0, 10),
      gender: initialValues.gender,
      fatherName: initialValues.fatherName,
    } : emptyStudent);
    setErrors({});
  }, [initialValues]);

  function changeValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSubmit({
      admissionNo: values.admissionNo.trim(),
      studentName: values.studentName.trim(),
      dob: values.dob,
      gender: values.gender,
      fatherName: values.fatherName.trim(),
    });
  }

  const fields = [
    { name: 'admissionNo', label: 'Admission No', placeholder: 'e.g. ADM-2026-014', maxLength: 30 },
    { name: 'studentName', label: 'Student Name', placeholder: 'Full name', maxLength: 80 },
    { name: 'fatherName', label: "Father's Name", placeholder: 'Full name', maxLength: 80 },
  ];

  return (
    <section className="form-panel" aria-labelledby="form-title">
      <div className="panel-heading">
        <h2 id="form-title">{editingId ? 'Edit Student' : 'Add Student'}</h2>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {fields.slice(0, 2).map((field) => (
            <div className="field" key={field.name}>
              <label htmlFor={field.name}>{field.label}<span className="required">*</span></label>
              <input
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={changeValue}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                autoComplete="off"
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                required
              />
              {errors[field.name] && <span className="field-error" id={`${field.name}-error`}>{errors[field.name]}</span>}
            </div>
          ))}
          <div className="field">
            <label htmlFor="dob">Date of Birth<span className="required">*</span></label>
            <input id="dob" name="dob" type="date" max={new Date().toISOString().slice(0, 10)} value={values.dob} onChange={changeValue} aria-invalid={Boolean(errors.dob)} aria-describedby={errors.dob ? 'dob-error' : undefined} required />
            {errors.dob && <span className="field-error" id="dob-error">{errors.dob}</span>}
          </div>
          <div className="field">
            <label htmlFor="gender">Gender<span className="required">*</span></label>
            <select id="gender" name="gender" value={values.gender} onChange={changeValue} aria-invalid={Boolean(errors.gender)} aria-describedby={errors.gender ? 'gender-error' : undefined} required>
              <option value="" disabled>Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="field-error" id="gender-error">{errors.gender}</span>}
          </div>
          <div className="field field-wide">
            <label htmlFor="fatherName">{fields[2].label}<span className="required">*</span></label>
            <input id="fatherName" name="fatherName" value={values.fatherName} onChange={changeValue} placeholder={fields[2].placeholder} maxLength={fields[2].maxLength} autoComplete="off" aria-invalid={Boolean(errors.fatherName)} aria-describedby={errors.fatherName ? 'fatherName-error' : undefined} required />
            {errors.fatherName && <span className="field-error" id="fatherName-error">{errors.fatherName}</span>}
          </div>
        </div>
        <div className="form-actions">
          {editingId && <button className="button button-quiet" type="button" onClick={onCancel} disabled={saving}>Cancel Edit</button>}
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Student' : 'Save Student'}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </section>
  );
}