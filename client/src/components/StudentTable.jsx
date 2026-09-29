function formatDate(date) {
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date.slice(0, 10)}T00:00:00`));
}

export default function StudentTable({ students, loading, search, onSearchChange, onEdit, onDelete }) {
  return (
    <section className="records-panel" aria-labelledby="records-title">
      <div className="records-heading">
        <div>
          <h2 id="records-title">All Students <span className="record-count">{students.length}</span></h2>
        </div>
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Search students</span>
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search students" />
          {search && <button className="clear-search" type="button" onClick={() => onSearchChange('')} aria-label="Clear search">×</button>}
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Admission No</th><th>Student Name</th><th>Date of Birth</th><th>Gender</th><th>Father's Name</th><th><span className="visually-hidden">Actions</span></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="table-message"><span className="spinner" />Loading student records...</td></tr>
            ) : students.length ? students.map((student) => (
              <tr key={student._id}>
                <td><span className="admission-value">{student.admissionNo}</span></td>
                <td className="student-cell">{student.studentName}</td>
                <td>{formatDate(student.dob)}</td>
                <td><span className="gender-tag">{student.gender}</span></td>
                <td>{student.fatherName}</td>
                <td>
                  <div className="row-actions">
                    <button className="text-action" type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.studentName}`}>Edit</button>
                    <button className="text-action delete-action" type="button" onClick={() => onDelete(student)} aria-label={`Delete ${student.studentName}`}>Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="empty-state">
                <span className="empty-mark" aria-hidden="true">—</span>
                <strong>{search ? 'No matching records' : 'No students yet'}</strong>
                <span>{search ? 'Try another admission number or name.' : 'Add a student using the form above to begin the register.'}</span>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}