import logo from './logo.svg';
import './App.css';
import { getAllStudents } from './client.js'
import { useEffect, useState } from 'react';
import { Empty, Table } from 'antd';
import Container from './Container';
import Footer from './Footer';
import Avatar from 'antd/lib/avatar/avatar';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import AddStudentForm from './forms/AddStudentForm';
import { errorNotification } from './Notification';

const getIndicatorIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {

  const [students, setStudents] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);

  const fetchStudents = () => {
    setIsFetching(true);
    getAllStudents()
      .then(res => res.json()
        .then(students => {
          console.log(students);
          setStudents(students);
          setIsFetching(false);
        }
        )
      )
      .catch(error => {
        let message = error.error.message;
        let description = error.error.error;
        errorNotification(message, description)
        setIsFetching(false);
      })
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const closeAddStudentModal = () => {
    setIsAddStudentModalVisible(false);
  };

  const openAddStudentModal = () => {
    setIsAddStudentModalVisible(true);
  };

  if (isFetching) {
    return (<Container><Spin indicator={getIndicatorIcon()}></Spin></Container>)
  }

  if (students && students.length) {

    const columns = [
      {
        title: '',
        key: 'avatar',
        render: (text, student) => (
          <Avatar size='large'>
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
          </Avatar>
        )
      },

      {
        title: 'Student Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'First name',
        dataIndex: 'firstName',
        key: 'firstName'
      },
      {
        title: 'Last name',
        dataIndex: 'lastName',
        key: 'lastName'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender'
      },
    ];
    return (
      <Container>
        <Table
          dataSource={students}
          columns={columns}
          rowkey='studentId'
          pagination={false} />
        <Modal title='test'
          visible={isAddStudentModalVisible}
          onCancel={closeAddStudentModal}
          onOk={closeAddStudentModal}
          width={1000}>
          <AddStudentForm onSuccess={() => {
            closeAddStudentModal();
            fetchStudents();
          }}
            onFailure={(error) => {
              console.log(JSON.stringify(error));
              let message = error.error.message;
              let description = error.error.error;
              errorNotification(message, description);
            }}></AddStudentForm>
        </Modal>
        <br />
        <br />
        <br />
        <Footer handleAddStudentClickEvent={openAddStudentModal} numberOfStudents={students.length} />
      </Container>
    )
  } else {
    return (
      <Container>
        <Empty description={
          <h1>No Students found</h1>
        } />
        <Modal title='test'
          visible={isAddStudentModalVisible}
          onCancel={closeAddStudentModal}
          onOk={closeAddStudentModal}
          width={1000}>
          <AddStudentForm onSuccess={() => {
            closeAddStudentModal();
            fetchStudents();
          }}></AddStudentForm>
        </Modal>
        <br />
        <br />
        <br />
        <Footer handleAddStudentClickEvent={openAddStudentModal} numberOfStudents={students.length} />
      </Container>

    )
  }
}

export default App;
