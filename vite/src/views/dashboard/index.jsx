// material-ui
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import FullFeaturedCrudGrid from '../../ui-component/data-grid/FullFeaturedCrudGrid';

import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard title="Growth Assessment Chart">
                    <FullFeaturedCrudGrid />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
