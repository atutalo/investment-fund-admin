import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { MenuItem, Select } from '@mui/material';

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    EditToolbar.propTypes = {
        setRows: PropTypes.func.isRequired,
        setRowModesModel: PropTypes.func.isRequired
    };

    const handleClick = async () => {
        const newRow = { type: '', category: '', attribute: '', detail: '', isNew: true };
        try {
            const response = await fetch('http://localhost:3001/growthTraits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRow)
            });
            const addedRow = await response.json();
            setRows((oldRows) => [{ id: addedRow.id, ...newRow }, ...oldRows]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [addedRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'detail' }
            }));
        } catch (error) {
            console.error('Error adding growth assessment trait:', error);
        }
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export default function FullFeaturedCrudGrid() {
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    // TODO: Add ability to select level and filter rows based on level
    const [selectedLevel, setSelectedLevel] = useState('engineerTwo');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/growthTraits');
                const data = await response.json();
                setRows(data);
            } catch (error) {
                console.error('Error fetching growth assessment traits:', error);
            }
        };
        fetchData();
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            await fetch(`http://localhost:3001/growthTraits/${id}`, {
                method: 'DELETE'
            });
            setRows(rows.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Error deleting growth assessment trait:', error);
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        await fetch(`http://localhost:3001/growthTraits/${newRow.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRow)
        });
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'type', headerName: 'Type', width: 100, editable: true },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            editable: true
        },
        {
            field: 'attribute',
            headerName: 'Attribute',
            width: 150,
            editable: true
        },
        {
            field: 'detail',
            headerName: 'Detail',
            width: 400,
            editable: true
        },
        {
            field: 'selfRating',
            headerName: 'Self Rating',
            width: 175,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Unpracticed', 'Emerging', 'Practicing', 'Consistent', 'Radiating']
        },
        {
            field: 'mentorRating',
            headerName: 'Mentor Rating',
            width: 175,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Unpracticed', 'Emerging', 'Practicing', 'Consistent', 'Radiating']
        },
        {
            field: 'leaderRating',
            headerName: 'Leader Rating',
            width: 175,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Unpracticed', 'Emerging', 'Practicing', 'Consistent', 'Radiating']
        },
        {
            field: 'requiredLevels',
            headerName: 'Required Levels',
            width: 175,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Unpracticed', 'Emerging', 'Practicing', 'Consistent', 'Radiating'],
            renderCell: (params) => {
                const requiredLevels = params.row.requiredLevels || {};
                return <div>{requiredLevels[selectedLevel]}</div>;
            },
            renderEditCell: (params) => {
                console.log(params);
                const requiredLevels = params.row.requiredLevels || {};
                const handleChange = (event) => {
                    const newValue = event.target.value;
                    params.api.setEditCellValue({
                        id: params.id,
                        field: params.field,
                        value: { ...requiredLevels, [selectedLevel]: newValue }
                    });
                };
                return (
                    <Select value={requiredLevels[selectedLevel] || ''} onChange={handleChange} variant="outlined" fullWidth={true}>
                        <MenuItem value="Unpracticed">Unpracticed</MenuItem>
                        <MenuItem value="Emerging">Emerging</MenuItem>
                        <MenuItem value="Practicing">Practicing</MenuItem>
                        <MenuItem value="Consistent">Consistent</MenuItem>
                        <MenuItem value="Radiating">Radiating</MenuItem>
                    </Select>
                );
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 180,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={`save-${id}`}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main'
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={`cancel-${id}`}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={`edit-${id}`}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={`delete-${id}`}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />
                ];
            }
        }
    ];

    return (
        <Box
            sx={{
                height: 700,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary'
                },
                '& .textPrimary': {
                    color: 'text.primary'
                }
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel }
                }}
            />
        </Box>
    );
}
