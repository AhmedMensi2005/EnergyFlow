import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createAccount } from "../../../services/authService";

import "./createAccount.css";


export default function CreateAccount(){

    const navigate = useNavigate();
    const {
        invitation_id,
        token
    }=useParams();


    const [form,setForm] = useState({

        username:"",
        password:"",
        confirmPassword:""

    });


    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);



    const handleChange = (e)=>{

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async(e)=>{

        e.preventDefault();

        setError("");


        if(
            form.password !== form.confirmPassword
        ){

            setError(
                "Passwords do not match."
            );

            return;

        }


        try{

            setLoading(true);


            await createAccount({

                invitation_id: invitation_id,
        
                token: token,
        
                username: form.username,
        
                password: form.password
        
            });


            navigate("/login");


        }
        catch(error){

            setError(
                error.response?.data?.error ||
                "Invalid invitation."
            );

        }
        finally{

            setLoading(false);

        }

    };



    return (

        <div className="create-account-page">
    
            <div className="create-account-card">
    
    
                <div className="create-account-header">
    
                    <h1>
                        Create your account
                    </h1>
    
                    <p>
                        Welcome to EnergyFlow. Complete your setup.
                    </p>
    
                </div>
    
    
                <form
                    className="create-account-form"
                    onSubmit={handleSubmit}
                >
    
    
                    <input
    
                        type="text"
    
                        name="username"
    
                        placeholder="Username"
    
                        value={form.username}
    
                        onChange={handleChange}
    
                    />
    
    
                    <input
    
                        type="password"
    
                        name="password"
    
                        placeholder="Password"
    
                        value={form.password}
    
                        onChange={handleChange}
    
                    />
    
    
                    <input
    
                        type="password"
    
                        name="confirmPassword"
    
                        placeholder="Confirm password"
    
                        value={form.confirmPassword}
    
                        onChange={handleChange}
    
                    />
    
    
                    {
                        error &&
    
                        <p className="create-account-error">
    
                            {error}
    
                        </p>
                    }
    
    
                    <button
    
                        className="create-account-btn"
    
                        type="submit"
    
                        disabled={loading}
    
                    >
    
                        {
                            loading
                            ?
                            "Creating account..."
                            :
                            "Create account"
                        }
    
    
                    </button>
    
    
                </form>
    
    
            </div>
    
    
        </div>
    
    );

}