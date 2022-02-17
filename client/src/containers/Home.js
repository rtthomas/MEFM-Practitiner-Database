/**
* Implements the Home View
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import HomeSidebar from '../components/HomeSidebar'
import  '../css/home.css';

class Home extends Component {

    constructor(props){
        super(props);
        this.goToPage = this.goToPage.bind(this);
    }

    goToPage(page){
        this.props.history.push(page);
    }

    render() {

        const elements = [
            {id: '#Background', title: 'Background'},
            {id: '#CBS', title: 'Community Based Solution'},
            {id: '#HF4ME', title: 'HealthFinder4ME .org'},
            {id: '#UTD', title: 'Using the database'},
            {id: '#HGTL', title: 'Help grow this list'},
            {id: '#DSC', title: 'Disclaimer'},
            {id: '#MP', title: 'Moderator policy'},
            {id: '#AMEFM', title: 'ME and Fibromyalgia'}
        ]
        
        return (
            <div className='container left home' >
                <div class='sidebar-container'>
                    <div class='sidebar-text'>
                        <p className='large-text'>
                        This site has been created by the <a href="https://www.mefm.bc.ca/" target="_blank" rel="noopener noreferrer">ME/FM Society of BC</a> as
                        a resource for British Columbians and other Canadians living with ME (<a href="https://www.mefm.bc.ca/me-info" target="_blank" rel="noopener noreferrer">myalgic encephalomyelitis</a>) 
                        and <a href="https://www.mefm.bc.ca/fm-info" target="_blank" rel="noopener noreferrer">fibromyalgia</a>    
                        </p>
                        <p id='Background' className='red-header'>Background</p>
                        <p>
                        The number one question our Society receives, whether by phone, email or via social 
                        media: <span className='bold italic large-text'>Can you refer me to a knowledgeable doctor?</span>    
                        </p><p>
                        The reality is that there exists a severe shortage of medical and health care professionals who are knowledgeable 
                        about myalgic encephalomyelitis (ME) or fibromyalgia.
                        </p><p> 
                        Lack of research, education and knowledge about the disorders has resulted in inequitable and grossly inadequate health 
                        care for ME and fibromyalgia patients seeking medical help. Instead of appropriate testing, diagnosis, management and treatment, 
                        patients are confronted by misinformation, negligence and systemic stigma. People living with ME and fibromyalgia are 
                        left to deal with these life-changing and disabling illnesses on their own. 
                        </p><p> 
                        Often interaction with the medical system is so negative that it adds to the illness burden for ME and fibromyalgia patients.
                        Dealing with the disrespect and neglect that are the byproducts of stigma has meant that many patients come out of these 
                        health care interactions also suffering from PTSD.
                        </p><p>
                        The <a href="https://www.mefm.bc.ca/" target="_blank" rel="noopener noreferrer">ME/FM Society of BC</a> is advocating for 
                        medical education, stigma elimination and awareness raising in the health care sector. But this takes time.  
                        </p>
                    </div>
                    <HomeSidebar elements={elements}></HomeSidebar>
                </div>
                <p id='CBS' className='red-header'>A Community Based Solution</p>
                <p>
                In the meantime, we have created <span className='red'>HealthFinder4ME</span> with the goal of providing a platform for people 
                living with ME and fibromyalgia to share much needed information about health care practitioners, in any discipline, 
                who they have found helpful on their health care journey. 
                </p>
                <p className='bold large-text'>Listed practitioners can include:</p>
                <ul className='list'>
                    <li>
                    Medical Doctors and other health care providers who may have a little or a lot of knowledge about ME and/or fibromyalgia;
                    </li>
                    <li>
                    Medical Doctors and other health care providers who patients have educated about their conditions;   
                    </li>
                    <li>
                    Medical Doctors and other health care providers who may or may not be knowledgeable about ME or fibromyalgia, but who have 
                    been helpful in other ways, whether by providing referrals, providing prescriptions, being helpful in obtaining disability 
                    income and home support, being helpful in completing forms;     
                    </li>
                    <li>
                    Medical Doctors and other health care providers who are simply respectful; and    
                    </li>
                    <li>
                    Allied and complementary health care professionals who have been helpful to ME and fibromyalgia patients.    
                    </li>
                </ul>
                {this.props.loggedInUser ?
                    '' :
                    <div className='actions'>
                        <Button type='button' className='action' onClick={() => this.goToPage('/practitioners')}>View Practitioners List</Button>
                        <Button type='button' className='action' onClick={() => this.goToPage('/search')}>Search For Practitioner</Button>
                        <Button type='button' className='action' onClick={() => this.goToPage('/sign-in')}>Register or Sign In</Button>
                    </div>
                }
                <p id='HF4ME' className='red-header'>HealthFinder4ME.org</p>
                <p>On our website you’ll find:</p>
                <ul className='list'>
                    <li>
                    Information about health care practitioners shared by users  that is easy to search by name, location and health care discipline.
                    </li>
                    <li>
                    A comprehensive questionnaire and rating system that allows users to submit information and answers to frequently asked questions 
                    about physicians. All users who have had experience with a newly-listed or  listed practitioner can complete the questionnaire, 
                    rating their personal experience, and adding more information about that practitioner.    
                    </li>
                    <li>
                    A comment section for each entry.    
                    </li>
                    <li>
                    The database can be searched without registering, however, registration is required in order to add a new practitioner to the system, to 
                    rate a practitioner, or add comments.    
                    </li>
                </ul>
                <p id='UTD' className='red-header'>Using the database</p>
                <ul className='list'>
                    <li>
                    The HealthFinder4ME database <span className='bold'>can be searched </span><span className='bold underline'>without </span><span className='bold'>registering.</span> 
                    </li>
                    <li>
                    <span className='bold'>Registration is required</span> in order to add a new practitioner, to add your own evaluation, or to comment on a listing.    
                    </li>
                </ul>
                <div className='indented'>
                <p><span className='bold large-text'>To add a new practitioner:</span></p>
                <ol className='list'>
                    <li>
                    <a onClick={() => this.goToPage('/sign-in')}>Register on the site.</a> There is no cost involved.
                    </li>
                    <li>
                    Check to see if the practitioner is already on our list.    
                    </li>
                    <li>
                    If the practitioner is not on the list, click  
                    {this.props.loggedInUser ? 
                        <> on <a onClick={() => this.goToPage('/new-practitioner')}>“Recommend”</a> and follow instructions.</> 
                        : <> on “Recommend”  and follow instructions.</>}
                    </li>
                </ol>
                <p><span className='bold large-text'>To add a recommendation to an already listed practitioner:</span></p>
                <ol className='list'>
                    <li>
                    <a onClick={() => this.goToPage('/sign-in')}>Register on the site.</a> There is no cost involved.
                    </li>
                    <li>
                    Go to the practitioner’s listing.    
                    </li>
                    <li>
                    Click on <span className='bold'>“View Listing”</span>    
                    </li>
                    <li>
                    Click on <span className='bold'>“Evaluation”</span>    
                    </li>
                    <li>
                    Click on <span className='bold'>“Add your own evaluation”</span>    
                    </li>
                </ol>
                <p><span className='bold large-text'>To comment on a listing:</span></p>
                <ol className='list'>
                    <li>
                    <a onClick={() => this.goToPage('/sign-in')}>Register on the site.</a> There is no cost involved.
                    </li>
                    <li>
                    Click on <span className='bold'>“Comments”.</span>    
                    </li>
                    <li>
                    Click on <span className='bold'>“Add a new Comment”</span>, or click on <span className='bold'>“reply”</span> to respond to an existing comment.   
                    </li>
                </ol>
                </div>
                <p id='HGTL' className='red-header'>Help grow this list! Add your recommendations, reviews and comments</p>
                <p>
                The more recommendations added to our list by users, the larger and more useful the database is for the broader ME and fibromyalgia community. 
                So keep adding your favourite health care providers to our list, and <span className='bold'>keep coming back!</span>
                </p>
                <p id='DSC' className='red-header'>Disclaimer</p>
                <p>
                Neither the ME/FM Society of BC, nor the moderators or administrators of this site recommend or approve any of 
                the practitioners listed on this site. All information has been provided by users and is not verified by our Society, 
                administrators or moderators. While we hope that the information is up-to-date, we depend on our users to submit updates.    
                </p>
                <p id='MP' className='red-header'>Moderator policy</p>
                <p>
                Please respect that this is a public site providing useful information for ME and fibromyalgia patients, not a place 
                to “let it all out”. While we want honest comments and information, the goal is to provide information about helpful 
                health care providers, and not to provide a platform to excoriate doctors or other healthcare professionals. 
                Moderators will remove any offending comments.    
                </p>
                <p id='AMEFM' className='red-header'>ME and Fibromyalgia</p>
                <p>
                ME (<a href="https://www.mefm.bc.ca/me-info" target="_blank" rel="noopener noreferrer">myalgic encephalomyelitis</a>) 
                and <a href="https://www.mefm.bc.ca/fm-info" target="_blank" rel="noopener noreferrer">fibromyalgia</a> are
                complex chronic diseases which affect over one million Canadians. Both conditions have been subjected to systemic 
                stigma in the health care system, resulting in a severe shortage of knowledgeable doctors and other health care practitioners. 
                This has left patients desperately seeking professional medical support for diagnosis and treatment. 
                In many cases the stigma faced by patients seeking health care has led to the prescription of harmful treatments and 
                exposure to traumatic experiences, which add to their disease burden.    
                </p>
                <p className='bold'>
                    To learn more about ME and fibromyalgia: <a href="https://www.mefm.bc.ca/" target="_blank" rel="noopener noreferrer">mefm.bc.ca</a> 
                </p>
                <p className='red-header'>About the ME/FM Society of BC</p>
                <p>
                The ME/FM Society of BC is a charity, run by patients, carers and their families, formed to help and support patients 
                with <span className='bold'>Myalgic Encephalomyelitis</span> * (ME) and/or <span className='bold'>Fibromyalgia</span> (FM).    
                </p>
                <p>
                Our society works to help ME and FM patients in British Columbia improve their health and quality of life by providing 
                information about these illnesses, and guidance on how to seek and obtain support, appropriate medical help and treatments. 
                We also focus on informing health care professionals, educators and students about ME and FM, as well as raising awareness among, 
                and seeking the support of the  government and the general public.    
                </p>
                <p className='bold'>
                Learn more about our Society and our online resources at our website: <a href="https://www.mefm.bc.ca/" target="_blank" rel="noopener noreferrer">mefm.bc.ca</a>    
                </p>
                <div className='footnote'>
                *Myalgic Encephalomyelitis is also referred to as ME/CFS, Chronic Fatigue Syndrome or SEID
                </div>
                <div className='footnote right'>
                    <span className='copyright'>© ME/FM Society of BC 2020</span>
                    <span className='right'>
                    Healthfinder4ME created by <a href="https://www.linkedin.com/in/robert-thomas-82297515/" target="_blank" rel="noopener noreferrer">Robert Thomas</a>
                    </span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.userReducer.loggedInUser
    }
}

export default connect(mapStateToProps)(Home);