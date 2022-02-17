import React from 'react';

/**
 * Displays a list of all moderators
 * @param {*} props 
 */
const moderatorList = props => {

    if (!props.moderators){
        return <div/>
    }

    const moderators = [];
    Object.values(props.moderators).forEach(moderator => {
        moderator.username = props.users[moderator.userId].username;
        moderator.email = props.users[moderator.userId].email
        moderators.push(moderator);
    });

    // NOTE: react-bootstrap Button sizing seems not to work to render a small button. Hence use of <input type='button'...
    return (
        <table>
            <thead>
                <tr>
                    <th>Province</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>URL</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {moderators.map((moderator) => {
                    const action = moderator.status === 'ENABLED' ? 'Disable' : 'Enable'
                    return (
                        <tr key={moderator.id}>
                            <td>{moderator.province}</td>
                            <td>{moderator.username}</td>
                            <td>{moderator.email}</td>
                            <td><a href={moderator.url} target="_blank" rel="noopener noreferrer">{moderator.url}</a></td>
                            <td><input style={{'width': '6em'}} type='button' name={moderator.id} value={action} onClick={() => props.switchStatus({...moderator})}></input></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default moderatorList;