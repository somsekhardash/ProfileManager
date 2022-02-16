import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Image,
    Button,
    Select,
    DropdownItemProps,
    Icon,
    Checkbox,
    Message
} from 'semantic-ui-react';
import { REACT_APP_GRAPHQL } from './config';
import { makeDropdownObject } from './Helper/FormHelper';

const FormExampleFieldControlId = ({ user, userid, setLoader}: any) => {
    const categoryOptions = makeDropdownObject([
        'Architecture',
        'Interior Design and Decoration',
        'Outdoor Design',
        'Other'
    ]);

    const professionOptions: any = {
        architecture: makeDropdownObject([
            'Interior Architect',
            'Building Architect',
            'Residential Architect'
        ]) as DropdownItemProps[],
        'interior-design-and-decoration': makeDropdownObject([
            'Decorator',
            'Design Consultant',
            'Interior Design Consultant',
            'Interior Designer',
            'Stager',
            'Kitchen Designer'
        ]) as DropdownItemProps[],
        'outdoor-design': makeDropdownObject([
            'Landscape Architect',
            'Landscape Designer'
        ]) as DropdownItemProps[],
        other: makeDropdownObject([
            'Architectural/Interior Photographer',
            'Organization Services',
            'Art Consultant',
            'Restoration Specialist',
            'Stylist',
            'Sustainability Consultant'
        ]) as DropdownItemProps[]
    };

    const [disableAll, setDisableAll] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formValue, setFormValues] = useState({
        profile_name: '',
        company_name: '',
        category: '',
        profession: '',
        email: '',
        website: '',
        willing_to_travel: false,
        profile_tagline: '',
        bio: '',
        image_sl: '',
        phone_number: '',
        social_media_profile: ''
    });

    useEffect(() => {
        const applicationForm = window.localStorage.getItem('ApplicationForm')
            ? JSON.parse(window.localStorage.getItem('ApplicationForm') || '')
            : null;
        if (applicationForm)
            setFormValues({
                ...applicationForm
            });

        if (REACT_APP_GRAPHQL && userid) {
            console.log(REACT_APP_GRAPHQL, userid);
            // setLoader(true);
            const requestBody = {
                query: `query {
                    fetchApplication(id:"${userid}"){
                        profile_name,
                        company_name,
                        category,
                        profession,
                        email,
                        website,
                        willing_to_travel,
                        profile_tagline,
                        bio,
                        image_sl,
                        phone_number,
                        social_media_profile
                    }
                }`
            };
           
            fetch(REACT_APP_GRAPHQL as string, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((res: any) => {
                    if (res.errors) {
                        // setErr(res.errors[0].message);
                    }
                    const data = res?.data?.fetchApplication;
                    if (data && !!res?.data?.fetchApplication) {
                        setFormValues({
                            profile_name: data.profile_name || '',
                            company_name: data.company_name || '',
                            category: data.category || '',
                            profession: data.profession || '',
                            email: data.email || '',
                            website: data.email || '',
                            willing_to_travel: data.willing_to_travel || false,
                            profile_tagline: data.profile_tagline || '',
                            bio: data.bio || '',
                            image_sl: formValue.image_sl,
                            phone_number: data.phone_number || '',
                            social_media_profile:
                                data.social_media_profile || ''
                        });
                        setDisableAll(true);
                        setIsSubmitted(true);
                        setLoader(false);
                        // setErr('');
                    }
                });
        }
    }, [userid]);

    const handleInputChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [event.target.name]: event.target.value
        }));
    };

    const handleSelectChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [data.name]: data.value
        }));
    };

    const handleCheckboxChange = (event: any, data: any) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [data.name]: data.checked
        }));
    };

    function onImageChange(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();
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
        window.localStorage.setItem(
            'ApplicationForm',
            JSON.stringify(formValue)
        );
    };

    const clearData = () => {
        window.localStorage.removeItem('ApplicationForm');
        setFormValues({
            profile_name: '',
            company_name: '',
            category: '',
            profession: '',
            email: '',
            website: '',
            willing_to_travel: false,
            profile_tagline: '',
            bio: '',
            image_sl: '',
            phone_number: '',
            social_media_profile: ''
        });
    };

    const saveApplication = () => {
        if (REACT_APP_GRAPHQL && userid) {
            const requestBody = {
                query: `mutation {
                    createApplication(applicationInput: {
                      user: "${userid}",
                      profile_name: "${formValue.profile_name}",
                      company_name: "${formValue.company_name}",
                      category: "${formValue.category}",
                      profession: "${formValue.profession}",
                      email: "${formValue.email}",
                      website: "${formValue.website}",
                      willing_to_travel: ${formValue.willing_to_travel},
                      profile_tagline: "${formValue.profile_tagline}",
                      bio: "${formValue.bio}",
                      image_sl: "${formValue.image_sl}",
                      phone_number: "${formValue.phone_number}",
                      social_media_profile: "${formValue.social_media_profile}"
                    }), {
                      email
                    }
                  }`
            };
            console.log(requestBody);
            fetch(REACT_APP_GRAPHQL as string, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.json())
                .then((res: any) => {
                    const data = res.data.createApplication;
                    window.localStorage.removeItem('ApplicationForm');
                    setDisableAll(true);
                    setIsSubmitted(true);
                })
        }
    };

    return (
        <div>
            <Message
                attached
                header="Welcome User!"
                content="Fill out the form below for a new account"
            />
            <Form className="attached fluid segment">
                <Form.Group widths="equal">
                    <Image
                        label={{
                            as: 'a',
                            color: 'black',
                            content: 'Hero Image',
                            icon: 'user circle',
                            ribbon: true
                        }}
                        size="medium"
                        disabled={disableAll}
                        src={
                            formValue.image_sl ||
                            'https://react.semantic-ui.com/images/wireframe/image.png'
                        }
                    />
                    {!isSubmitted && (
                        <Input
                            type="file"
                            name="myImage"
                            hidden
                            onChange={onImageChange}
                            accept="image/png, image/jpeg"
                        />
                    )}
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field
                        id="form-input-control-first-name"
                        control={Input}
                        label="Profile Name"
                        name="profile_name"
                        placeholder="Profile Name"
                        value={formValue.profile_name}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                    <Form.Field
                        id="form-input-control-last-name"
                        control={Input}
                        label="Company name"
                        name="company_name"
                        placeholder="Company Name"
                        value={formValue.company_name}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field
                        id="form-select-control-category"
                        control={Select}
                        options={categoryOptions}
                        label={{
                            children: 'Category',
                            htmlFor: 'form-select-control-category'
                        }}
                        placeholder="Category"
                        name="category"
                        onChange={handleSelectChange}
                        disabled={disableAll}
                        value={formValue.category}
                    />

                    {formValue.category && (
                        <Form.Field
                            id="form-select-control-profession"
                            control={Select}
                            options={professionOptions[formValue.category]}
                            label={{
                                children: 'Profession',
                                htmlFor: 'form-select-control-profession'
                            }}
                            placeholder="Please Select"
                            name="profession"
                            onChange={handleSelectChange}
                            disabled={disableAll}
                            value={formValue.profession}
                        />
                    )}
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field
                        id="form-input-control-email"
                        control={Input}
                        label="Email"
                        name="email"
                        placeholder="Email"
                        value={formValue.email}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />

                    <Form.Field
                        id="form-input-control-phone_number"
                        control={Input}
                        label="Mobile"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formValue.phone_number}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field
                        id="form-input-control-social_media_profile"
                        control={Input}
                        label="Social Media Profile"
                        name="social_media_profile"
                        placeholder="Social Media Profile"
                        value={formValue.social_media_profile}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                    <Form.Field
                        id="form-input-control-website"
                        control={Input}
                        label="Website"
                        name="website"
                        placeholder="Website"
                        value={formValue.website}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field
                        id="form-input-control-tag-line"
                        control={Input}
                        label="Profile Tagline"
                        name="profile_tagline"
                        placeholder="Profile Tagline"
                        value={formValue.profile_tagline}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />

                    <Form.Field
                        id="form-input-control-bio"
                        control={Input}
                        label="Bio"
                        name="bio"
                        placeholder="Bio"
                        value={formValue.bio}
                        disabled={disableAll}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Field>
                    <Checkbox
                        label="Willing to travel"
                        name="willing_to_travel"
                        checked={formValue.willing_to_travel}
                        disabled={disableAll}
                        onChange={handleCheckboxChange}
                    />
                </Form.Field>

                {!isSubmitted && (
                    <>
                        <Button primary type="submit" onClick={saveApplication}>
                            Submit
                        </Button>
                        <Button color="orange" onClick={clearData}>
                            ClearData
                        </Button>
                        <Button secondary type="submit" onClick={saveDraft}>
                            Save Draft
                        </Button>
                    </>
                )}
            </Form>
            {isSubmitted && (
                <Message attached="bottom" warning>
                    <Icon name="help" />
                    Your Application is Under Review Please Wait
                </Message>
            )}
        </div>
    );
};

export default FormExampleFieldControlId;
