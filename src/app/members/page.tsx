"use client";
import Navbar from "@/components/Navigation";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { columns, Member } from "./columns";
export default function Members() {
  const [switchDetector, setSwitchDetector] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const array = [
    { name: "Luca Klecina", team: "82855T" },
    { name: "Samit Hedge", team: "82855T" },
    { name: "Daniel Lee", team: "82855T" },
    { name: "Joel Wong", team: "82855T" },
    { name: "William Wen", team: "82855T" },
    { name: "Neil Wan", team: "82855T" },
    { name: "Jayden Fu", team: "82855T" },
    { name: "Ethan Guan", team: "82855T" },
    { name: "Justin Wen Hao Wu", team: "82855T" },

    { name: "Evan Ding", team: "82855X" },
    { name: "Rishabh Mishra", team: "82855X" },
    { name: "Jessica Weng", team: "82855X" },
    { name: "Fiona Liang", team: "82855X" },
    { name: "Evan Wang", team: "82855X" },
    { name: "Sophia Weng", team: "82855X" },
    { name: "Wesley Li", team: "82855X" },
    { name: "Ava Wu", team: "82855X" },
    { name: "Alison Yoon", team: "82855X" },
    { name: "Peilin (Perry) Song", team: "82855X" },

    { name: "Jahan Shah", team: "82855Y" },
    { name: "Vivian Francis", team: "82855Y" },
    { name: "James Fok", team: "82855Y" },
    { name: "Lucas Chan", team: "82855Y" },
    { name: "Benjamin Belyavsky", team: "82855Y" },
    { name: "Irena Chu", team: "82855Y" },
    { name: "Yejun Kim", team: "82855Y" },
    { name: "Danny Ching", team: "82855Y" },
    { name: "Cameron Boland", team: "82855Y" },
    { name: "Victor Chan", team: "82855Y" },

    { name: "Sharon Basovich", team: "82855S" },
    { name: "Yichen Xiao", team: "82855S" },
    { name: "Aiden Wu", team: "82855S" },
    { name: "Maximillian Han", team: "82855S" },
    { name: "Patrick Zhang", team: "82855S" },
    { name: "Soroush Paidar", team: "82855S" },
    { name: "David (Dawei) Shen", team: "82855S" },
    { name: "Katerina Pelo", team: "82855S" },
    { name: "Niu Niu Li", team: "82855S" },

    { name: "Kerry Li", team: "82855G" },
    { name: "Justin Ng", team: "82855G" },
    { name: "Jacob Hong", team: "82855G" },
    { name: "Kenny Zhang", team: "82855G" },
    { name: "Darren Hong", team: "82855G" },
    { name: "Rayson Zuo", team: "82855G" },
    { name: "Ethan Yueng", team: "82855G" },
    { name: "William Chan", team: "82855G" },
    { name: "Jacob Kwak", team: "82855G" },

    { name: "Kevin He", team: "82855Z" },
    { name: "Eric Benning", team: "82855Z" },
    { name: "Kaley Wu", team: "82855Z" },
    { name: "Kensen Wang", team: "82855Z" },
    { name: "Jonathan Gu", team: "82855Z" },
    { name: "Enoch Hui", team: "82855Z" },
    { name: "Dylan Clarizio", team: "82855Z" },
    { name: "Joshua Yu", team: "82855Z" },
    { name: "Jonathan Yu", team: "82855Z" },
  ];
  const addMembers = async () => {
    try {
      const res = await fetch(`/api/member-list`, {
        method: "POST",
        body: JSON.stringify({
          
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log("Error posting members:", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/member-list`);
      const data = await result.json();
      const temp: Member[] = [];
      data.forEach((member: any) => {
        temp.push({
          _id: member._id,
          name: member.name,
          team: member.team,
        });
      });
      setMembers(temp);
    };
    fetchData();
  }, [switchDetector]);
  return (
    <div>
      <Navbar />

      <div className="mx-6 md:mx-24 py-16">
        <Button onClick={() => addMembers()}>goobers</Button>
        <div className="text-2xl md:text-3xl font-bold my-2">Members</div>
        <div className="mb-8 text-sm md:text-base">Edit team member list.</div>
        <div className="text-xl md:text-2xl font-semibold mt-8 mb-4">
          Member List
        </div>
        <DataTable
          columns={columns(
            "yourCollection",
            "yourTeam",
            () => setSwitchDetector(!switchDetector),
            () => setOpen(true)
          )}
          data={members}
        />
      </div>
    </div>
  );
}
