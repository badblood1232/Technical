import axios from "axios"
import { useState } from "react"

function Register () {
    const [data, setData] = useState({
        username: "",
        mantra: "",
        email: "",
        password: "",
        photo: null
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photo") {
            setData({ ...data, photo: files[0] });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleClick = (e) => {
        e.preventDefault();

        if (!data.username || !data.email || !data.password) {
            setMessage("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("mantra", data.mantra);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("photo_path", data.photo?.name || "");

        axios.post("http://localhost:3001/api/register", formData)
            .then((res) => {
                setMessage("Registration successful!");
                setData({
                    username: "",
                    mantra: "",
                    email: "",
                    password: "",
                    photo: null
                });
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Registration failed";
                setMessage(msg);
            });
    };

    return (
        <div>
            <h1>Register</h1>
            <form>
                <label>Username</label><br />
                <input
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    required
                /><br />

                <label>Mantra</label><br />
                <input
                    type="text"
                    name="mantra"
                    value={data.mantra}
                    onChange={handleChange}
                /><br />

                <label>Email</label><br />
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                /><br />

                <label>Password</label><br />
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                /><br />

                <label>Photo (.bmp)</label><br />
                <input
                    type="file"
                    name="photo"
                    accept=".bmp"
                    onChange={handleChange}
                /><br /><br />

                <button type="submit" onClick={handleClick}>Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
