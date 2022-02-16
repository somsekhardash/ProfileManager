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
    Message,
    Card
} from 'semantic-ui-react';

import { REACT_APP_GRAPHQL } from './config';
import { makeDropdownObject } from './Helper/FormHelper';
import { useHttp } from './Auth/AuthProvider';


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

const AdminPage = () => {
    const userHttp = useHttp();
    const [data, setData] = useState({
        users: [] as any,
        formData: {
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
        }
    });

    useEffect(() => {
        const requestBody = {
            query: `query {
                fetchAllApplications{
                application{
                    user
                    profile_name
                    company_name
                    category
                    profession
                    phone_number
                    email
                    website
                    willing_to_travel
                    profile_tagline
                    bio
                    image_sl
                    social_media_profile
                    application_status{
                    status_type
                    commment
                    }
                }
                    user{
                    email
                    }
                }
                }`
        };
        userHttp.makeTheCall(
            REACT_APP_GRAPHQL as string,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            (res: any) => {
                if (res.errors) {
                    userHttp.error = res.errors[0].message;
                } else {
                    const allApplications = res.data.fetchAllApplications;
                    setData({
                        ...data,
                        users: [...allApplications]
                    });
                }
            }
        );
    }, []);

    const formValue = data.formData;
    const disableAll = true;

    const setUserContent = (userdata: any) => {
        setData({
            ...data,
            formData: {
                profile_name: userdata.application.profile_name,
                company_name: userdata.application.company_name,
                category: userdata.application.category,
                profession: userdata.application.profession,
                email: userdata.application.email,
                website: userdata.application.website,
                willing_to_travel: userdata.application.willing_to_travel,
                profile_tagline: userdata.application.profile_tagline,
                bio: userdata.application.bio,
                image_sl: userdata.application.image_sl,
                phone_number: userdata.application.phone_number,
                social_media_profile: userdata.application.social_media_profile
            }
        })
    }

    return (
        <div className="admin-page">
            <div className="side-panel">
                <Card.Group>
                    {data.users.map((user: any, index: number)=>{
                        return (<Card key={index} onClick={() =>setUserContent(user)}>
                            <Card.Content>
                                <Card.Header>{user.user.email}</Card.Header>
                                <Card.Meta>Co-Worker</Card.Meta>
                                <Card.Description>
                                    Matthew is a pianist living in Nashville.
                                </Card.Description>
                            </Card.Content>
                        </Card>)
                    })}
                </Card.Group>
            </div>
            <div className="result-panel">
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
                    />
                    <Form.Field
                        id="form-input-control-last-name"
                        control={Input}
                        label="Company name"
                        name="company_name"
                        placeholder="Company Name"
                        value={formValue.company_name}
                        disabled={disableAll}
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
                    />

                    <Form.Field
                        id="form-input-control-phone_number"
                        control={Input}
                        label="Mobile"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formValue.phone_number}
                        disabled={disableAll}
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
                    />
                    <Form.Field
                        id="form-input-control-website"
                        control={Input}
                        label="Website"
                        name="website"
                        placeholder="Website"
                        value={formValue.website}
                        disabled={disableAll}
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
                    />

                    <Form.Field
                        id="form-input-control-bio"
                        control={Input}
                        label="Bio"
                        name="bio"
                        placeholder="Bio"
                        value={formValue.bio}
                        disabled={disableAll}
                    />
                </Form.Group>

                <Form.Field>
                    <Checkbox
                        label="Willing to travel"
                        name="willing_to_travel"
                        checked={formValue.willing_to_travel}
                        disabled={disableAll}
                    />
                </Form.Field>
            </Form>
            </div>
        </div>
    );
};

export default AdminPage;
