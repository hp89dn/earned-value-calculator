import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { FirestoreDocument } from '@react-firebase/firestore';
import React, { useState } from 'react'
import { useParams } from 'react-router';
import { EarnedValueScreen } from '../EarnedValueScreen'
export const EarnValueScreen = () => {
    const { item_id } = useParams<{ item_id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div>

            <FirebaseAuthConsumer>
                {({ isSignedIn, user, providerId }) => {
                    return (
                        isSignedIn ?
                            <FirestoreDocument path={`/${user.uid}/${item_id}`}>
                                {(d: any) => {
                                    setIsLoading(d.isLoading);
                                    const list = d && d.value && d.value.list ? d.value.list : '';
                                    if (!d.isLoading && list) {
                                        return d.isLoading ? "Loading" : <EarnedValueScreen data={JSON.parse(list)} />;
                                    }

                                }}
                            </FirestoreDocument>
                            :
                            ""
                    );
                }}
            </FirebaseAuthConsumer>
            <div hidden={!isLoading} style={{ marginTop: '40vh', transform: 'translateY(-50%)' }}>

                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
