import styled from 'styled-components';
import { Button, Box } from '@mui/material';

export const StyledButton = styled(Button)`
    &.MuiButton-contained {
        background-color: #1976d2;
    }
    &.MuiButton-outlined {
        border-color: #1976d2;
        color: #1976d2;
    }
`;

export const StyledBox = styled(Box)`
    display: flex;
    gap: 10px;
`;

export const StyledForm = styled(Box)`
    margin-top: 20px;
`;

export const StyledMessageBox = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.alignEnd ? "flex-end" : "flex-start")};
    margin-bottom: 16px;
`;

export const UserMessage = styled(Box)`
    background-color: #e0f7fa;
    padding: 16px;
    border-radius: 10px;
    max-width: 80%;
`;

export const BotMessage = styled(Box)`
    background-color: #f1f8e9;
    padding: 16px;
    border-radius: 10px;
    max-width: 80%;
    margin-top: 8px;
`;