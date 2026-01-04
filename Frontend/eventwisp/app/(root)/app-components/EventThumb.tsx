import React from 'react'
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface Event {
    image: string;
    title: string;
    date: string;
    contentCount: string | number;
    description: string;
    link: string;
}

interface EventCardProps {
    event: Event;
}

const EventThumb:React.FC<EventCardProps> = ({ event }) => {
    return (
        <>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">Sign Up</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div>
                    {/*    image*/}
                        <div >
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
export default EventThumb
