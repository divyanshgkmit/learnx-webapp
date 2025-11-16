import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { InteractiveDotBackground } from "@/components/ui/InteractiveDotBackground";
import { PlayCircle, CheckCircle, BookOpen, Award, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { STATS_DATA, STEPS_DATA, FEATURE_CARDS } from "@/constants";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-blue-400/30 selection:text-white">
      <InteractiveDotBackground />

      <div className="relative z-10">
        <Header />

        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium my-6 border border-blue-500/30 backdrop-blur-xs">
                <Star className="w-4 h-4" />
                Transform Your Learning Journey
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Learn Without <span className="text-blue-400">Limits</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students and instructors in our
                comprehensive learning platform. Master new skills with
                expert-led courses and interactive video content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="min-w-2xs bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-lg border-0"
                >
                  <Link to={ROUTES.REGISTER} className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Start Learning
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-w-2xs border-gray-600 text-black hover:bg-gray-300 px-8 py-5 text-lg"
                >
                  <Link to={ROUTES.COURSES} className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Browse Courses
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS_DATA.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
                  <div className="text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-15">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Comprehensive tools and features designed for effective
                learning and teaching
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURE_CARDS.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Card
                    key={index}
                    className="text-center border-gray-800 bg-slate-800/50 backdrop-blur-xs"
                  >
                    <CardHeader className="pb-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${card.utilityClass}`}
                      >
                        <IconComponent
                          className={`w-8 h-8`}
                        />
                      </div>
                      <CardTitle className="text-xl text-white">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4 text-left">
                        {card.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle
                              className={`w-5 h-5 ${card.textClass} mt-0.5 shrink-0`}
                            />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-15">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How LearnX Works
              </h2>
              <p className="text-xl text-gray-300">
                Simple steps to start your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS_DATA.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <span className="text-blue-400 font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-15 text-white relative">
          <div className="absolute inset-0"></div>
          <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
            <Award className="w-16 h-16 mx-auto mb-6 text-blue-500/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Skills?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join LearnX today and unlock access to world-class courses, expert
              instructors, and a community of passionate learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-md font-semibold border-0 cursor-pointer"
              >
                <Link to={ROUTES.REGISTER}>Start Learning Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-3 text-md font-semibold border-0 cursor-pointer"
              >
                <Link to={ROUTES.COURSES}>View Course Catalog</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;