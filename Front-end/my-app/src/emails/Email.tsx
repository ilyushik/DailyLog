import {Button, Container, Html, Img, Text} from "@react-email/components";
import * as React from "react";

export function Email(props) {
    // const message = "Your request has been received!";
    // const link = "http://localhost:3000/my-info";
    // const buttonText = "Back to application"
    // const name = "Illia Kamarali"

    return (
        <Html>
            <Container style={main_block}>
                <Img style={logo_img} src="https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/logo.png?alt=media&token=93653c9c-70e3-4712-a19a-1d2be87c25b4"/>
                <Container style={info_block}>
                    <Text style={greeting_text}>Hi, there! 👋</Text>
                    <Text style={message_text}>{props.message}</Text>
                </Container>
                <Button href={props.link} style={button}>
                    {props.buttonText}
                </Button>

                <Container style={footer_container}>
                    <Text style={text_made_by}>Made by:</Text>
                    <Container style={devs_container}>
                        <Text style={name_text}>Illia Kamarali</Text>
                        <Text style={name_text}>Bohdan Khokhlov</Text>
                    </Container>
                </Container>
            </Container>
        </Html>
    );
}

export default Email;

const main_block = {
    width: "80vw",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
}

const logo_img = {
    width: "5vw",
    minWidth: "50px",
    marginBottom: "5vh",
}

const info_block = {

}

const greeting_text = {
    fontWeight: "500",
    fontFamily: "Sans-serif",
    fontSize: "15px",
    marginBottom: "5vh"
}

const message_text = {
    fontWeight: "500",
    fontFamily: "Sans-serif",
    fontSize: "15px"
}

const button = {
    borderRadius: "10px 10px 10px 10px",
    backgroundColor: "#617DA6",
    padding: "10px",
    color: "white",
    fontWeight: "550",
    fontFamily: "Sans-serif"
}

const footer_container = {
    marginTop: "5vh",
    borderTop: "1px solid black",
}

const text_made_by = {
    fontWeight: "500",
    fontFamily: "Sans-serif",
    fontSize: "12px",
    height: "5px"
}

const devs_container = {
    marginLeft: "15px"
}

const name_text = {
    fontWeight: "500",
    fontFamily: "Sans-serif",
    fontSize: "12px",
    height: "5px"
}
