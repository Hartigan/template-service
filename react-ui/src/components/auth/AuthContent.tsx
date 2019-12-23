import * as React from 'react'

export type IAuthContentProps = {
    api: any;
    user: any;
}

export default class AuthContent extends React.Component<IAuthContentProps> {
    public render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <pre>{JSON.stringify(this.props.user)}</pre>
                </div>
                <div className="col-md-6">
                    <pre>{JSON.stringify(this.props.api)}</pre>
                </div>
            </div>
        );
    }
}