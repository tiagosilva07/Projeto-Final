import  ContactHeader  from "@/components/contact/ContactHeader"
import  ContactForm  from "@/components/contact/ContactForm"
import  ContactInfo  from "@/components/contact/ContactInfo"

export default function Contact() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-16">
      <div className="flex justify-center">
        <img src="https://picsum.photos/200" alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
      </div>
      <ContactHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <ContactInfo />
      </div>

    </div>
  )
}
