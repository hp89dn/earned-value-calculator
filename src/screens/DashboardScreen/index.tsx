import { Button } from "@material-ui/core";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { FirestoreCollection } from "@react-firebase/firestore";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import axios from "../../api/index";
import { ToastContainer, toast } from "react-toastify";
import * as datefns from "date-fns";
import { AddBoxTwoTone } from "@material-ui/icons";
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
  const notifyCreateSuccess = () => toast("Tạo thành công");
  const notifyCreateError = () => toast("Tạo thất bại");
  const notifyDeleteSuccess = () => toast("Xoá thành công");
  const notifyDeleteError = () => toast("Xoá thất bại");

  const renderCard = (
    uid: string,
    project_name: string,
    created_at: string,
    image: string,
    item_id: string
  ) => {
    return (
      <Card className={classes.root}>
        <CardActionArea onClick={() => history.push(`/earnvalue/${item_id}`)}>
          <CardMedia
            className={classes.media}
            image={image}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {project_name ? project_name : "(Chưa có tên)"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Đã tạo:{" "}
              {datefns.formatDistance(new Date(created_at), new Date()) +
                " | " +
                datefns.format(new Date(created_at), "dd/MM/yyyy HH:mm:ss")}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            onClick={() => history.push(`/earnvalue/${item_id}`)}
            size="small"
            color="primary"
          >
            Xem
          </Button>
          <Button
            onClick={() => handleDeleteItem(uid, item_id)}
            size="small"
            color="primary"
          >
            Xoá
          </Button>
        </CardActions>
      </Card>
    );
  };

  const handleCreateNewItem = async (uid: string) => {
    const newData = {
      uid: uid,
      created_at: new Date(),
    };
    try {
      const response = await axios.post("api/admin/create", newData);
      notifyCreateSuccess();
      history.push("/earnvalue/" + response.data.id);
    } catch (error) {
      notifyCreateError();
    }
  };

  const handleDeleteItem = (uid: string, id: string) => {
    const newData = {
      uid: uid,
      id: id,
    };
    axios
      .post(`api/admin/delete/uid=${String(uid)}}/id=${String(id)}`, newData)
      .then(() => {
        notifyDeleteSuccess();
      })
      .catch(() => {
        notifyDeleteError();
      });
  };
  return (
    <div>
      <FirebaseAuthConsumer>
        {({ isSignedIn, user, providerId }) => {
          return isSignedIn ? (
            <FirestoreCollection path={`/${user.uid}/`}>
              {(d) => {
                return d.isLoading ? (
                  <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: "40vh", transform: "translateY(-50%)" }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleCreateNewItem(user.uid)}
                    >
                      <AddBoxTwoTone /> Tạo mới
                    </Button>
                    <div
                      className="row d-flex flex-row mt-3"
                      hidden={[...d.value].length <= 0}
                    >
                      {[...d.value].map((value) => (
                        <div className="col-3">
                          {renderCard(
                            user.uid,
                            value.project_name,
                            value.created_at,
                            "https://www.colorbook.io/imagecreator.php?width=1920&height=1080",
                            value.id
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </FirestoreCollection>
          ) : (
            ""
          );
        }}
      </FirebaseAuthConsumer>
      <ToastContainer />
    </div>
  );
};
