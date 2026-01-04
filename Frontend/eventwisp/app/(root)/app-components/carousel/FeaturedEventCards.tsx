import React from 'react'
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";

const FeaturedEventCards = () => {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-sm"
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-full sm:basis-1/10 md:basis-1/3 lg:basis-1/4">
                        <Card className="h-72 w-full">
                            <CardContent className="flex items-center justify-center h-full">
                                <span className="text-3xl font-semibold">{index + 1}</span>
                            </CardContent>
                        </Card>
                    </CarouselItem>

                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
export default FeaturedEventCards;
