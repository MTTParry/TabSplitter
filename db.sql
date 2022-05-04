--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6
-- Dumped by pg_dump version 13.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "tabSplitter";
--
-- Name: tabSplitter; Type: DATABASE; Schema: -; Owner: mttparry
--

CREATE DATABASE "tabSplitter" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE "tabSplitter" OWNER TO mttparry;

\connect "tabSplitter"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bill_list; Type: TABLE; Schema: public; Owner: mttparry
--

CREATE TABLE public.bill_list (
    bill_id integer NOT NULL,
    transaction_date date,
    subtotal numeric(7,2),
    tax_rate numeric(5,4),
    tip_rate numeric(5,4),
    who_paid integer,
    paid_up boolean,
    bill_notes text,
    creationtimestamp timestamp without time zone,
    full_total numeric(8,2),
    tax_total numeric(7,2),
    tip_total numeric(7,2)
);


ALTER TABLE public.bill_list OWNER TO mttparry;

--
-- Name: bill_list_bill_id_seq; Type: SEQUENCE; Schema: public; Owner: mttparry
--

CREATE SEQUENCE public.bill_list_bill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bill_list_bill_id_seq OWNER TO mttparry;

--
-- Name: bill_list_bill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mttparry
--

ALTER SEQUENCE public.bill_list_bill_id_seq OWNED BY public.bill_list.bill_id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: mttparry
--

CREATE TABLE public.contacts (
    contact_id integer NOT NULL,
    first_name text,
    last_name text,
    email text,
    preferred_payment_method text,
    creation_timestamp timestamp without time zone
);


ALTER TABLE public.contacts OWNER TO mttparry;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: mttparry
--

ALTER TABLE public.contacts ALTER COLUMN contact_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: debt_list; Type: TABLE; Schema: public; Owner: mttparry
--

CREATE TABLE public.debt_list (
    debt_id integer NOT NULL,
    which_bill integer,
    how_much numeric(7,2),
    who_paid integer,
    who_owes integer,
    debt_paid_up boolean,
    debt_notes text,
    creationtimestamp timestamp without time zone,
    subtotal numeric(7,2)
);


ALTER TABLE public.debt_list OWNER TO mttparry;

--
-- Name: debt_list_debt_id_seq; Type: SEQUENCE; Schema: public; Owner: mttparry
--

CREATE SEQUENCE public.debt_list_debt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.debt_list_debt_id_seq OWNER TO mttparry;

--
-- Name: debt_list_debt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mttparry
--

ALTER SEQUENCE public.debt_list_debt_id_seq OWNED BY public.debt_list.debt_id;


--
-- Name: bill_list bill_id; Type: DEFAULT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.bill_list ALTER COLUMN bill_id SET DEFAULT nextval('public.bill_list_bill_id_seq'::regclass);


--
-- Name: debt_list debt_id; Type: DEFAULT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.debt_list ALTER COLUMN debt_id SET DEFAULT nextval('public.debt_list_debt_id_seq'::regclass);


--
-- Data for Name: bill_list; Type: TABLE DATA; Schema: public; Owner: mttparry
--

COPY public.bill_list (bill_id, transaction_date, subtotal, tax_rate, tip_rate, who_paid, paid_up, bill_notes, creationtimestamp, full_total, tax_total, tip_total) FROM stdin;
2	2022-04-25	40.00	0.0862	0.2000	2	f	Pete's	2022-04-26 11:19:00	51.45	3.45	8.00
1	2022-04-18	101.40	0.0862	0.0000	2	f	Zazie's - They don't expect tips	2022-04-25 12:00:00	110.14	8.74	0.00
3	2022-04-28	85.83	0.0863	0.2097	4	t	Ginza sushi	2022-04-29 13:40:00	111.24	7.41	18.00
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: mttparry
--

COPY public.contacts (contact_id, first_name, last_name, email, preferred_payment_method, creation_timestamp) FROM stdin;
2	Zenzo	the Chinchilla	test@test.com	Venmo (@...)	2022-04-25 12:00:00
3	Bootsy	Olwen	test@no.com	Venmo (@...)	2022-04-25 12:00:00
1	Colonel Peeves	MaCavity	col.snake.butler@gmail.com	Venmo (@...) or check	2022-04-25 12:00:00
4	Rose	Toes	tes@notarealemail.com	Cash money	2022-04-26 11:39:00
9	Guest	\N	\N	You'll need to contact this person directly, on your own.	2022-04-28 13:50:41.106635
8	Dog	Food	test@testtest.com	No pay, only play	2022-04-28 13:50:41.106635
10	Sandy	Cheeks	no@no.com	Cash money in my hands	2022-04-28 14:02:30.513444
13	Rain of	Terror	test2@gmail.com	Cash	2022-04-29 09:44:53.149162
14	Burger	King	test@test.com	cashapp(@...)	2022-05-02 13:06:31.890603
19	\N	\N	test@no.com	The souls of the innocent	2022-05-04 11:08:25.334444
\.


--
-- Data for Name: debt_list; Type: TABLE DATA; Schema: public; Owner: mttparry
--

COPY public.debt_list (debt_id, which_bill, how_much, who_paid, who_owes, debt_paid_up, debt_notes, creationtimestamp, subtotal) FROM stdin;
1	1	47.74	2	3	f	2 eggs(29), 1 mocha (6.95), 1 pancake (24/3)	2022-04-25 12:00:00	43.95
2	1	33.13	2	1	t	1 egg (16), 1 chai (6.5), 1 pancake (24/3)	2022-04-25 12:00:00	30.50
3	3	55.62	4	1	f	even split	2022-04-29 15:35:00	46.62
\.


--
-- Name: bill_list_bill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mttparry
--

SELECT pg_catalog.setval('public.bill_list_bill_id_seq', 5, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mttparry
--

SELECT pg_catalog.setval('public.contacts_id_seq', 19, true);


--
-- Name: debt_list_debt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mttparry
--

SELECT pg_catalog.setval('public.debt_list_debt_id_seq', 5, true);


--
-- Name: bill_list bill_list_pkey; Type: CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.bill_list
    ADD CONSTRAINT bill_list_pkey PRIMARY KEY (bill_id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (contact_id);


--
-- Name: debt_list debt_list_pkey; Type: CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.debt_list
    ADD CONSTRAINT debt_list_pkey PRIMARY KEY (debt_id);


--
-- Name: bill_list bill_list_who_paid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.bill_list
    ADD CONSTRAINT bill_list_who_paid_fkey FOREIGN KEY (who_paid) REFERENCES public.contacts(contact_id);


--
-- Name: debt_list debt_list_which_bill_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.debt_list
    ADD CONSTRAINT debt_list_which_bill_fkey FOREIGN KEY (which_bill) REFERENCES public.bill_list(bill_id);


--
-- Name: debt_list debt_list_who_owes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.debt_list
    ADD CONSTRAINT debt_list_who_owes_fkey FOREIGN KEY (who_owes) REFERENCES public.contacts(contact_id);


--
-- Name: debt_list debt_list_who_paid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mttparry
--

ALTER TABLE ONLY public.debt_list
    ADD CONSTRAINT debt_list_who_paid_fkey FOREIGN KEY (who_paid) REFERENCES public.contacts(contact_id);


--
-- PostgreSQL database dump complete
--

