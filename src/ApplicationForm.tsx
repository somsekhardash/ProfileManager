import React,{useEffect, useState} from 'react'
import { Form, Input, Image, Button, Select, DropdownItemProps, Icon, Checkbox, Label, Message } from 'semantic-ui-react'
import { makeDropdownObject } from './Helper/FormHelper';

const FormExampleFieldControlId = () => {
    
    const categoryOptions = makeDropdownObject(['Architecture', 'Interior Design and Decoration', 'Outdoor Design', 'Other']);

    const professionOptions: any = {
        "architecture": makeDropdownObject(["Interior Architect", "Building Architect", "Residential Architect"]) as DropdownItemProps[],
        "interior-design-and-decoration": makeDropdownObject(["Decorator", "Design Consultant", "Interior Design Consultant", "Interior Designer", "Stager", "Kitchen Designer"]) as DropdownItemProps[],
        "outdoor-design": makeDropdownObject(["Landscape Architect", "Landscape Designer"]) as DropdownItemProps[],
        "other": makeDropdownObject(["Architectural/Interior Photographer", "Organization Services", "Art Consultant", "Restoration Specialist","Stylist", "Sustainability Consultant"]) as DropdownItemProps[]
    }
    
    const [formValue, setFormValues] = useState({
        profile_name: '',
        company_name: '',
        category: '',
        profession: '',
        email:'',
        website: '',
        willing_to_travel: false,
        profile_tagline: '',
        bio: '',
        image_sl:'',
        phone_number:'',
        social_media_profile: ''
    });

    useEffect(()=>{
        const applicationForm= window.localStorage.getItem('ApplicationForm') ? JSON.parse(window.localStorage.getItem('ApplicationForm')|| '') : null;
        if(!!applicationForm)
            setFormValues({
                ...applicationForm
            });
    },[])

    const handleInputChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSelectChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [data.name]: data.value,
        }));
    };

    const handleCheckboxChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [data.name]: data.checked,
        }));
    };

    function onImageChange(e: any) {
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function () {
            console.log(reader.result);
            setFormValues((values) => ({
                ...values,
                image_sl: reader.result as any
            }));
        };
        reader.readAsDataURL(file);
    }

    const saveDraft = () => {
        window.localStorage.setItem('ApplicationForm', JSON.stringify(formValue));
    }

    const clearData = () => {
        window.localStorage.removeItem('ApplicationForm');
        setFormValues({
            profile_name: '',
            company_name: '',
            category: '',
            profession: '',
            email:'',
            website: '',
            willing_to_travel: false,
            profile_tagline: '',
            bio: '',
            image_sl:'',
            phone_number:'',
            social_media_profile: ''
        });
    }
    
  return <div>
        <Message
            attached
            header='Welcome User!'
            content='Fill out the form below for a new account'
        />
      <Form className='attached fluid segment'>
        <Form.Group widths='equal'>
            <Image
                label={{
                as: 'a',
                color: 'black',
                content: 'Hero Image',
                icon: 'user circle',
                ribbon: true,
                }}
                size='medium'
                src={formValue.image_sl || 'https://react.semantic-ui.com/images/wireframe/image.png'}
            />
        <Input type="file" name="myImage" hidden onChange={onImageChange} accept="image/png, image/jpeg"/>
        </Form.Group>
        <Form.Group widths='equal'>
            <Form.Field
                id='form-input-control-first-name'
                control={Input}
                label='Profile Name'
                name="profile_name"
                placeholder='Profile Name'
                value={formValue.profile_name}
                onChange={handleInputChange}
            />
            <Form.Field
                id='form-input-control-last-name'
                control={Input}
                label='Company name'
                name="company_name"
                placeholder='Company Name'
                value={formValue.company_name}
                onChange={handleInputChange}
            />
        </Form.Group>
        <Form.Group widths='equal'>
            <Form.Field
                id='form-select-control-category'
                control={Select}
                options={categoryOptions}
                label={{ children: 'Category', htmlFor: 'form-select-control-category' }}
                placeholder='Category'
                name="category"
                onChange={handleSelectChange}
                value={formValue.category}
            />

            {formValue.category && <Form.Field
                id='form-select-control-profession'
                control={Select}
                options={professionOptions[formValue.category]}
                label={{ children: 'Profession', htmlFor: 'form-select-control-profession' }}
                placeholder='Please Select'
                name="profession"
                onChange={handleSelectChange}
                value={formValue.profession}
            />} 
        </Form.Group>
        <Form.Group widths='equal'>
            <Form.Field
                id='form-input-control-email'
                control={Input}
                label='Email'
                name="email"
                placeholder='Email'
                value={formValue.email}
                onChange={handleInputChange}
            />

            <Form.Field
                id='form-input-control-phone_number'
                control={Input}
                label='Mobile'
                name="phone_number"
                placeholder='Phone Number'
                value={formValue.phone_number}
                onChange={handleInputChange}
            />

           
        </Form.Group>
        <Form.Group widths='equal'>
            <Form.Field
                id='form-input-control-social_media_profile'
                control={Input}
                label='Social Media Profile'
                name="social_media_profile"
                placeholder='Social Media Profile'
                value={formValue.social_media_profile}
                onChange={handleInputChange}
            />
             <Form.Field
                id='form-input-control-website'
                control={Input}
                label='Website'
                name="website"
                placeholder='Website'
                value={formValue.website}
                onChange={handleInputChange}
            /> 
                
        </Form.Group>
        <Form.Group widths='equal'>
            <Form.Field
                id='form-input-control-tag-line'
                control={Input}
                label='Profile Tagline'
                name="profile_tagline"
                placeholder='Profile Tagline'
                value={formValue.profile_tagline}
                onChange={handleInputChange}
            /> 

            <Form.Field
                id='form-input-control-bio'
                control={Input}
                label='Bio'
                name="bio"
                placeholder='Bio'
                value={formValue.bio}
                onChange={handleInputChange}
            /> 
     </Form.Group>
     
     <Form.Field>
        <Checkbox 
            label='Willing to travel' 
            name="willing_to_travel" 
            checked={formValue.willing_to_travel} 
            onChange={handleCheckboxChange}
        />
    </Form.Field>

    <Button primary type='submit'>Submit</Button>
    <Button color='orange' onClick={clearData}>ClearData</Button>
    <Button secondary type='submit' onClick={saveDraft}>Save Draft</Button>
  </Form>
    <Message attached='bottom' warning>
      <Icon name='help' />
      Already signed up?&nbsp;<a href='#'>Login here</a>&nbsp;instead.
    </Message>
  </div>
}

export default FormExampleFieldControlId;