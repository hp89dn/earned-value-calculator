import React from "react";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import "./App.css";
import { DrawerContainer } from "./containers";
import firebase from "firebase";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";

const browserHistory = createBrowserHistory();

const firebaseConfig = {
  apiKey: "AIzaSyALVtiGhTb4yABdIRCfEmBgXhPGRlEABlM",
  authDomain: "earned-value-calculator.firebaseapp.com",
  projectId: "earned-value-calculator",
  storageBucket: "earned-value-calculator.appspot.com",
  messagingSenderId: "682362722561",
  appId: "1:682362722561:web:6979c99ad9960d41b9e300",
  databaseURL: "https://earned-value-calculator.firebaseio.com",
};
const LayoutContainer = React.lazy(() =>
  import("./routes").then(({ Layout }) => ({ default: Layout }))
);

function App() {
  return (
    <Router history={browserHistory}>
      <React.Suspense fallback={null}>
        <React.StrictMode>
          <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
            <FirestoreProvider {...firebaseConfig} firebase={firebase}>
              <div>
                <DrawerContainer>
                  <LayoutContainer />
                </DrawerContainer>
              </div>
            </FirestoreProvider>
          </FirebaseAuthProvider>
        </React.StrictMode>
      </React.Suspense>
    </Router>
  );
}

export default App;
