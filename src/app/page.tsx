import Faq from "@/components/homepage/Faq";
import Featured from "@/components/homepage/Featured";
import Hero from "@/components/homepage/Hero";

export default function Home() {
    return (
        <div className="space-y-10">
            <Hero></Hero>
            <Featured></Featured>
            <Faq></Faq>
        </div>
    );
}
