import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced artificial intelligence analyzes X-ray images with medical-grade accuracy",
      badge: "Latest Technology"
    },
    {
      title: "Instant Reports",
      description: "Generate comprehensive diagnostic reports in seconds, not hours",
      badge: "Fast Results"
    },
    {
      title: "Professional Quality",
      description: "Structured reports following medical standards and best practices",
      badge: "Medical Grade"
    },
    {
      title: "Secure & Private",
      description: "HIPAA-compliant handling of all medical images and patient data",
      badge: "Secure"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">RadiologyAI</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Analysis
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              Next-Generation Medical AI
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered X-Ray Analysis for 
              <span className="text-blue-600"> Modern Radiology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your radiology practice with cutting-edge artificial intelligence. 
              Upload X-ray images and receive comprehensive diagnostic reports in seconds, 
              powered by advanced medical AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Upload X-Ray Image
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Demo Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f8acc459-c013-4ac1-b98d-81692d974f6f.png" 
                alt="Professional radiology workstation with X-ray displays" 
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Features for Modern Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with medical expertise 
              to deliver accurate, fast, and reliable diagnostic assistance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get professional diagnostic reports in minutes with our streamlined workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload X-Ray</h3>
              <p className="text-gray-600">
                Securely upload your X-ray images in JPEG, PNG, or DICOM format
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes the image and generates detailed findings
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Report</h3>
              <p className="text-gray-600">
                Receive a comprehensive diagnostic report ready for review and export
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/upload">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Your Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold">RadiologyAI</h3>
              </div>
              <p className="text-gray-400">
                Advancing healthcare through AI-powered medical imaging analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/upload" className="hover:text-white transition-colors">Upload X-Ray</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@radiologyai.com</li>
                <li>1-800-RADIOLOGY</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RadiologyAI. All rights reserved. HIPAA Compliant.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}