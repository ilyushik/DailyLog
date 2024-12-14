import { Button, Html, Img, Text } from "@react-email/components";
import * as React from "react";

export function Email(props) {
    return (
        <Html>
            <table
                width="100%"
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    margin: "20px auto",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    fontFamily: "'Arial', sans-serif",
                    boxSizing: "border-box",
                }}
            >
                <tr>
                    <td>
                        {/* Логотип */}
                        <table width="100%" style={{ marginBottom: "20px" }}>
                            <tr>
                                <td align="center">
                                    <Img
                                        style={{ width: "80px", height: "auto" }}
                                        src="https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/logo.png?alt=media&token=93653c9c-70e3-4712-a19a-1d2be87c25b4"
                                        alt="Logo"
                                    />
                                </td>
                            </tr>
                        </table>

                        {/* Основная информация */}
                        <table width="100%" style={{ textAlign: "center", padding: "10px" }}>
                            <tr>
                                <td>
                                    <Text
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "600",
                                            color: "#333",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Hi there! 👋
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#555",
                                            marginBottom: "20px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        {props.message}
                                    </Text>

                                    <Button
                                        href={props.link}
                                        style={{
                                            display: "inline-block",
                                            padding: "12px 24px",
                                            backgroundColor: "#617DA6",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                            fontWeight: "600",
                                            fontSize: "16px",
                                            width: "100%",
                                            maxWidth: "250px",
                                            textAlign: "center",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {props.buttonText}
                                    </Button>
                                </td>
                            </tr>
                        </table>

                        {/* Футер */}
                        <table
                            width="100%"
                            style={{
                                marginTop: "30px",
                                borderTop: "1px solid #ddd",
                                paddingTop: "15px",
                            }}
                        >
                            <tr>
                                <td align="center">
                                    <Text
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#777",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Made by:
                                    </Text>
                                    <table>
                                        <tr>
                                            <td style={{ textAlign: "center" }}>
                                                <Text
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#555",
                                                    }}
                                                >
                                                    Illia Kamarali
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        color: "#555",
                                                    }}
                                                >
                                                    Bohdan Khokhlov
                                                </Text>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </Html>
    );
}

export default Email;
