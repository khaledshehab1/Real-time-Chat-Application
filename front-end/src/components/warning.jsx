import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Message(props)
{            const navigate = useNavigate();

  return      <Modal
         className='shadow-lg border-1 rounded-1'
      show={props.show_confirm_button}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>navigate("login")}
    >
      <Modal.Header closeButton closeVariant="white" id="model" >
        <Modal.Title id="contained-modal-title-vcenter">
         <h2 >{props.title}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body  id="model">
        <h3> {props.message}</h3>
    
      </Modal.Body>
      <Modal.Footer id="model">
        <Button id="confirm_bt" className='px-4 py-2 pt-3 rounded-4' onClick={   async ()=>
                          {
                        props.set_show_confirm_button(false);

                          }
                        }
                          ><h5>Ok</h5></Button>
      </Modal.Footer>
    </Modal>
    ;
}
export default Message;