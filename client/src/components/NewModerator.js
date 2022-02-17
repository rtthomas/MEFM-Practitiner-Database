/**
 * Entry form to create a new Moderator account
 */
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import EditableText from './EditableText';
import Selector from './Selector';

const newModerator = props => {
    return (
    <Form horizontal>
        <div className='horizontal-group'>
        <div className='vertical-group'>
            <EditableText   label='Username'
                            name='username'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            value={props.username}
                            changeHandler={props.onChange} />

            <EditableText   label='Password' 
                            name='password'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            value={props.password}
                            changeHandler={props.onChange} />

            <EditableText   label='Confirm Password' 
                            name='confirmPassword'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            value={props.confirmPassword}
                            changeHandler={props.onChange} />
            
            <EditableText   label='Email'
                            type='email' 
                            name='email'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            value={props.email}
                            changeHandler={props.onChange} />

            <Selector       label='Province'
                            name='province'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            options={props.provinces}
                            value={{label: props.province, value: props.province}} 
                            placeholder='Select ...'
                            onChange={props.onSelect}/>
            
            <EditableText   label='Information URL'
                            type='url' 
                            name='url'
                            labelClass='info-label info-label-reg'
                            valueClass='info-field info-field-reg'
                            value={props.url}
                            changeHandler={props.onChange} />
            <Button type='button' className='button-large' onClick={props.onCreate}>Create</Button>
            {
                props.errorMessage ? <div className='error-message'>{props.errorMessage}</div> : ''
            }
        </div>
        </div>
    </Form>)
}

export default newModerator;