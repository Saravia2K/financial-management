"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import {
  TrendingUp,
  Shield,
  Target,
  PieChart,
  Wallet,
  ArrowRight,
  DollarSign,
  BarChart3,
  CreditCard,
} from "lucide-react";
import financeHero from "@/assets/finance-hero.jpg";

export default function FinanceLanding() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Smart Budgeting",
      description:
        "Track your spending and create budgets that work for your lifestyle.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Investment Tracking",
      description:
        "Monitor your portfolio performance and make informed investment decisions.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "Bank-level security ensures your financial data is always protected.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal Setting",
      description:
        "Set financial goals and track your progress with personalized insights.",
    },
  ];

  const stats = [
    {
      icon: <Wallet className="h-5 w-5" />,
      value: "10K+",
      label: "Active Users",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      value: "$2M+",
      label: "Money Tracked",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      value: "95%",
      label: "User Satisfaction",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      value: "50+",
      label: "Bank Integrations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${financeHero.src})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground leading-tight">
              Take Control of Your
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track expenses, manage budgets, and grow your wealth with our
              intelligent personal finance platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="lg"
                variant="hero"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-lg px-8 py-6 min-w-[200px]"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card"
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to
              <span className="text-primary"> Succeed Financially</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and insights to help you make smarter financial
              decisions and achieve your money goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-primary transition-all duration-300 hover:-translate-y-2 bg-card border-border"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 inline-flex p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have already taken control of their
            financial future.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setIsAuthModalOpen(true)}
            className="text-lg px-12 py-6 shadow-glow hover:shadow-primary transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
