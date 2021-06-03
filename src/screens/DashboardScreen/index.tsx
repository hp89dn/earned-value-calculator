import { Button } from '@material-ui/core';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { FirestoreCollection } from '@react-firebase/firestore';
import React from 'react'
import { EarnedValueScreen } from '../EarnedValueScreen';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});
export const DashboardScreen = () => {
    const classes = useStyles();
    const history = useHistory();
    const renderCard = (project_name: string, created_at: string, image: string, item_id: string) => {
        return (
            <Card className={classes.root} onClick={() => history.push(`/earnvalue/${item_id}`)}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={image}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {project_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Đã tạo lúc: {created_at}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
                        Xem
              </Button>
                    <Button size="small" color="primary">
                        Xoá
              </Button>
                </CardActions>
            </Card>
        );
    }
    return (
        <div>
            <FirebaseAuthConsumer>
                {({ isSignedIn, user, providerId }) => {
                    return (
                        isSignedIn ?
                            <FirestoreCollection path={`/${user.uid}/`}>
                                {d => {
                                    return d.isLoading ? "Loading" : <div>
                                        <Button variant="contained" color="secondary" onClick={() => history.push("/calculator")}>Tạo mới</Button>
                                        <div className="row d-flex flex-row mt-3" hidden={[...d.value].length <= 0}>
                                            {[...d.value].map(value => (
                                                <div className="col-3">
                                                    {renderCard(
                                                        value.project_name,
                                                        value.created_at,
                                                        "https://www.colorbook.io/imagecreator.php?width=1920&height=1080",
                                                        value.id
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }}
                            </FirestoreCollection>
                            :
                            ""
                    );
                }}
            </FirebaseAuthConsumer>

        </div >
    )
}
