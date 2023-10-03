import TextField from '@mui/material/TextField';

export default function Input(props) {
    return (
        <TextField
            id={props.id}
            label={props.label}
            variant="standard"
            type={props.type}
            fullWidth
        />
    );
}