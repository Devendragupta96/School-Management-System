import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getClassDetails, getClassStudents, getSubjectList, getTeachersByClass, updateObject } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';
import CustomBarChart from "../../../components/CustomBarChart";
import DynamicPopup from "../DynamicPopup";

const ClassDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, sclassStudents,teacherListClass, sclassDetails, loading, error, response, getresponse } = useSelector((state) => state.sclass);
    const [openPopup, setOpenPopup] = useState(false);
    const [editData, setEditData] = useState(null);

    const classID = params.id

    useEffect(() => {
        const fetchData = async () => {
            dispatch(getSubjectList(classID, "ClassSubjects"));
            dispatch(getClassStudents(classID));
            dispatch(getTeachersByClass(classID));
        };
    
        fetchData();
    }, [dispatch, classID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleEdit = (subjectData) => {
        setEditData(subjectData); // Set the data of the subject being edited
        setOpenPopup(true); // Open the popup
    };

    const handleUpdate = (updatedData, module) => {
        if(module==='subject'){
            dispatch(updateObject(updatedData._id,updatedData, "Subject")).then(() => {
                dispatch(getSubjectList(classID, "ClassSubjects"));
            });
        }else if (module ==="student"){
            dispatch(updateObject(updatedData._id,updatedData, "Student")).then(() => {
                dispatch(getClassStudents(classID));
            });
        }else if (module ==="teacher"){
            dispatch(updateObject(updatedData._id,updatedData, "Teacher")).then(() => {
                dispatch(getTeachersByClass(classID));
            });
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        // setShowPopup(true)
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getClassStudents(classID));
                dispatch(resetSubjects())
                dispatch(getSubjectList(classID, "ClassSubjects"))
            })
    }

    const subjectColumns = [
        { id: 'name', label: 'Subject Name', minWidth: 170 },
        { id: 'code', label: 'Subject Code', minWidth: 100 },
    ]

    const subjectRows = subjectsList && subjectsList.length > 0 ? subjectsList.map((subject) => {
        return {
            name: subject.subName,
            code: subject.subCode,
            id: subject._id,
        };
    }):[]

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/class/subject/${classID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
                <IconButton onClick={()=>handleEdit(row.id)}>
                    <EditIcon color="action" />
                </IconButton>
                {openPopup && (
                <DynamicPopup
                    open={openPopup}
                    setOpen={setOpenPopup}
                    data={editData}
                    module="subject"  // Pass module type (in this case "subject")
                    onSubmit={handleUpdate}  // Logic for updating the subject
                />
                )}
            </>
        );
    };

    const subjectActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/addsubject/" + classID)
        }
    ];

    const ClassSubjectsSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addsubject/" + classID)}
                        >
                            Add Subjects
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Subjects List:
                        </Typography>

                        <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
                        <SpeedDialTemplate actions={subjectActions} />
                    </>
                }
            </>
        )
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    })

    const StudentsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/students/student/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton>
                <IconButton onClick={()=>handleEdit(row.id)}>
                    <EditIcon color="action" />
                </IconButton>
                {openPopup && (
                <DynamicPopup
                    open={openPopup}
                    setOpen={setOpenPopup}
                    data={editData}
                    module="student"  // Pass module type (in this case "subject")
                    onSubmit={handleUpdate}  // Logic for updating the subject
                />
                )}
            </>
        );
    };

    const studentActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/class/addstudents/" + classID)
        }
    ];

    const ClassStudentsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            >
                                Add Students
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Students List:
                        </Typography>

                        <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
                        <SpeedDialTemplate actions={studentActions} />
                    </>
                )}
            </>
        )
    }

    const teachersColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'class', label: 'Class', minWidth: 100 },
        { id: 'subject', label: 'Subject', minWidth: 100 },
    ]

    const teacherRows =teacherListClass && teacherListClass?.map((teacher) => {
        return {
            name: teacher?.name,
            class: teacher.teachSclass?.sclassName,
            subject: teacher.teachSubject?.subName,
            id: teacher?._id,
        };
    })

    const TeachersButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/teachers/teacher/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
                <IconButton onClick={()=>handleEdit(row.id)}>
                    <EditIcon color="action" />
                </IconButton>
                {openPopup && (
                <DynamicPopup
                    open={openPopup}
                    setOpen={setOpenPopup}
                    data={editData}
                    module="teacher"  // Pass module type (in this case "subject")
                    onSubmit={handleUpdate}  // Logic for updating the subject
                />
                )}
            </>
        );
    };

    const ClassTeachersSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <h4>No Teachers</h4>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Teachers List:
                        </Typography>

                        <TableTemplate buttonHaver={TeachersButtonHaver} columns={teachersColumns} rows={teacherRows} />
                    </>
                )}
            </>
        )
    }

    const ClassDetailsSection = () => {
        const numberOfSubjects = subjectsList.length;
        const numberOfStudents = sclassStudents.length;

        const genderCounts = sclassStudents.reduce((acc, student) => {
            acc[student.gender] = (acc[student.gender] || 0) + 1;
            return acc;
        }, {});

        // Prepare data for the bar chart
        const chartData = [
            { subject: 'Male', attendancePercentage: genderCounts['Male'] || 0 },
            { subject: 'Female', attendancePercentage: genderCounts['Female'] || 0 },
            // Add more genders if necessary
        ];

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    This is Class {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Subjects: {numberOfSubjects}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Students: {numberOfStudents}
                </Typography>
                <Box sx={{ margin: '20px 0' }}>
                    <CustomBarChart chartData={chartData} dataKey="attendancePercentage" />
                </Box>
                {getresponse &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                    >
                        Add Students
                    </GreenButton>
                }
                {response &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                    >
                        Add Subjects
                    </GreenButton>
                }
            </>
        );
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Subjects" value="2" />
                                    <Tab label="Students" value="3" />
                                    <Tab label="Teachers" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <ClassDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <ClassSubjectsSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <ClassStudentsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <ClassTeachersSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ClassDetails;