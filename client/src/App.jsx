import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentForm from './components/StudentForm.jsx';
import StudentTable from './components/StudentTable.jsx';
import { studentApi } from './services/studentApi.js';

export default function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await studentApi.list();
      setStudents(result.data);
      setNotice(null);
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return students;
    return students.filter((student) => [student.admissionNo, student.studentName, student.fatherName]
      .some((value) => value.toLocaleLowerCase().includes(query)));
  }, [students, search]);

  async function saveStudent(values) {
    setSaving(true);
    setNotice(null);
    try {
      const result = editingStudent
        ? await studentApi.update(editingStudent._id, values)
        : await studentApi.create(values);
      setStudents((current) => editingStudent
        ? current.map((student) => student._id === result.data._id ? result.data : student)
        : [result.data, ...current]);
      setEditingStudent(null);
      setNotice({ type: 'success', text: result.message });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.studentName} (${student.admissionNo})? This cannot be undone.`)) return;
    setNotice(null);
    try {
      const result = await studentApi.remove(student._id);
      setStudents((current) => current.filter((item) => item._id !== student._id));
      if (editingStudent?._id === student._id) setEditingStudent(null);
      setNotice({ type: 'success', text: result.message });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  }

  function beginEdit(student) {
    setEditingStudent(student);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <span className="brand">Student Management System</span>
        <span className="header-section">Student Records</span>
      </header>

      <div className="content-stack">
        <h1 className="page-title">Student Records</h1>
        {notice && <div className={`notice notice-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          <span className="notice-symbol" aria-hidden="true">{notice.type === 'success' ? '✓' : '!'}</span>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">×</button>
        </div>}
        <StudentForm
          editingId={editingStudent?._id}
          initialValues={editingStudent}
          onSubmit={saveStudent}
          onCancel={() => setEditingStudent(null)}
          saving={saving}
        />
        <StudentTable
          students={visibleStudents}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onEdit={beginEdit}
          onDelete={deleteStudent}
        />
      </div>
    </main>
  );
}