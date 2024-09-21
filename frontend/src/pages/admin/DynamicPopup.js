import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from '@mui/material';

// Dynamic popup form component
const DynamicPopup = ({ open, setOpen, data, module, onSubmit }) => {
    const [formData, setFormData] = useState({});

    // Set initial form data based on the passed data prop
    useEffect(() => {
        if (data) {
            setFormData({_id:data});
        }
    }, [data]);

    // Handle input changes in the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = () => {
        onSubmit(formData, module);
        setOpen(false);      // Close the popup
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <DialogTitle>{`Edit ${module.charAt(0).toUpperCase() + module.slice(1)}`}</DialogTitle>
            <DialogContent>
                {module === 'subject' && (
                    <>
                        <TextField
                            name="subName"
                            label="Subject Name"
                            value={formData.subName || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="subCode"
                            label="Subject Code"
                            value={formData.subCode || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="sessions"
                            label="Sessions"
                            value={formData.sessions || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
                {module === 'student' && (
                    <>
                        <TextField
                            name="name"
                            label="Subject Name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="rollNum"
                            label="Roll Number"
                            placeholder='Roll Number'
                            value={formData.rollNum  || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <Select fullWidth
                            name='gender'
                            placeholder='Gender'
                            labelId="gender-select-label"
                            id="gender-select"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            label="Select Class"
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                <em>Select Gender</em>
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                        <TextField
                            name="dob"
                            label="Date of Birth"
                            type='date'
                            value={formData.dob || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
                {module === 'teacher' && (
                    <>
                        <TextField
                            name="name"
                            label="Name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={()=>handleSubmit()} color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DynamicPopup;
