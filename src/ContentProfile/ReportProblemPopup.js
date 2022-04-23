import streamingServices from '../Services.json' 
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';
import './ContentProfile.css';

const ReportProblemPopup = (props) => {
    const id = props.id;

    function listServiceOptions(){
        var i = 0;
        return(
            streamingServices.map((cont) => (
                <option value={cont.name} key={i++}>{cont.name}</option>
            ))
        );
    }

    function sendEmail(e) {
        e.preventDefault();
        const elementsArray =[...e.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) =>{
            if (currentValue.id){
                accumulator[currentValue.id]= currentValue.value;
            }
            return accumulator;
        },{});
        emailjs.sendForm('service_q8akaed', 'template_q0cdh28', e.target, 'user_hYCVxI0KQt3ZFIZhx5psT')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
          
        e.target.reset();
      toast.success('Form Submitted Successfully! Thank you!');
    }

    return (  
        <div className="popupText">
            <form onSubmit={sendEmail}>
                <div> Are one of our links not working? Or our information incorrect?</div>
                <label htmlFor="content_id">Content ID Key (<i>filled out automatically</i>)</label>
                <input className="form-control" type="text" value={id} id="content_id" name="content_id" readOnly></input>
                <label htmlFor="action">Action: (<i>filled out automatically</i>)</label>
                <input className="form-control" type="text" value="Broken Link" id="action" name="action" readOnly></input>
                <label htmlFor="service_name">For which service is the link not working?</label>
                <select id='service_name'className="form-control mdb-select md-form" searchable="Search here..." defaultValue="" required>
                    <option value=""> Choose...</option>
                    {listServiceOptions()}
                </select>
                <br/>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
 
export default ReportProblemPopup;