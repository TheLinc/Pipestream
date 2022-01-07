
import 'bootstrap/dist/css/bootstrap.css';
import emailjs from 'emailjs-com';
import toast, { Toaster } from 'react-hot-toast';
import '../ContactUs/ContactUs.css'

const Contactus = () => {

    function sendEmail (e) {
        e.preventDefault();

        const elementsArray =[...e.target.elements];
        const formData = elementsArray.reduce((accumulator, currentValue) =>{
            if (currentValue.id){
                accumulator[currentValue.id]= currentValue.value;
            }
            return accumulator;
        },{});

        const formEmail = formData.emailInput;
        const formEmailC = formData.confirmemailInput;
        if (formEmail === formEmailC){
            emailjs.sendForm('service_q8akaed', 'template_01y3qne', e.target, 'user_hYCVxI0KQt3ZFIZhx5psT')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
          
          e.target.reset();
          toast.success('Form Submitted Successfully! Thank you!');
        }
        else{
            toast.error('The emails input did not match. Please try again.')
        }
    }

    return ( 
        <div className="container-sm">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="row justify-content-center" style={{paddingTop:"25px"}}>
                <h1 style={{color:"white"}}>Contact Us</h1>
                <div style={{color:"white"}}> 
                   <p> Feel free to contact us about any inquiries or issues regarding our site. Any and all feedback is appreciated. We will respond within 1-3 business days. </p>
                </div>
                <div className="col-sm-8" style={{paddingBottom:"20px"}}>
                <form onSubmit={sendEmail}>
                    <div className="form-group" style={{textAlign:"left"}}>
                        <div style={{paddingBottom:"10px"}}>
                        <label for="nameInput" style={{color:"white"}}>Name</label>
                        <input type="text" className="form-control" id="nameInput" name="nameInput" aria-describedby="name" placeholder="Your Name" required></input>
                        </div>
                        <div style={{paddingBottom:"10px"}}>
                            <label for="emailInput" style={{color:"white"}}>Email Address</label>
                            <input type="email" className="form-control" id="emailInput" name="emailInput" aria-describedby="contactusemail" placeholder="Enter Email" required></input>
                        </div>
                        <div style={{paddingBottom:"10px"}}>
                            <label for="confrimemailInput" style={{color:"white"}}>Confirm Email Address</label>
                            <input type="email" className="form-control" id="confirmemailInput" name="confirmemailInput" aria-describedby="confrimcontactusemail" placeholder="Re-enter Email" required></input> 
                        </div>
                        <div style={{paddingBottom:"10px"}}>
                            <label for="subjectInput" style={{color:"white"}}>Subject</label>
                            <input type="text" className="form-control" id="subjectInput" name="subjectInput" aria-describedby="subject" placeholder="Enter Subject" required></input>
                        </div>  
                    </div>
                    <br/>
                    <div className="form-group" style={{textAlign:"left"}}>
                        <label for="textArea" style={{color:"white"}}>Message</label>
                        <textarea className="form-control" id="textArea" name="textArea" rows="6" required></textarea>
                    </div>
                    <br/>
                    <div className="form-group"style={{textAlign:"left"}}>
                        <button className="btn btn-primary sendButton"><b>Send</b></button>
                    </div>
                    
                </form>
                </div>
            </div>
        </div>
     );
}
 
export default Contactus;